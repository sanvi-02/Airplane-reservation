"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  flightId: string;
  seatId: string;
  seatNumber: string;
  flightNumber: string;
  origin: string;
  destination: string;
  price: number;
}

export default function BookingForm({
  flightId,
  seatId,
  seatNumber,
  flightNumber,
  origin,
  destination,
  price,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Razorpay order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price, seatId, flightId }),
      });

      if (!orderRes.ok) {
        setError("Could not initiate payment. Try again.");
        return;
      }

      const { orderId } = await orderRes.json();

      // 2. Load Razorpay script dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
      }

      // 3. Open Razorpay checkout popup
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: price * 100,
          currency: "INR",
          name: "Flight Booking",
          description: `${flightNumber} · Seat ${seatNumber}`,
          order_id: orderId,
          prefill: { name, email },
          theme: { color: "#C9974A" },

          handler: async (response: any) => {
            try {
              // 4. Verify payment signature
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              const { verified, paymentId } = await verifyRes.json();

              if (!verified) {
                setError(
                  "Payment verification failed. Please contact support.",
                );
                setLoading(false);
                reject();
                return;
              }

              // 5. Create booking with paymentId
              const bookRes = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  seatId,
                  passengerName: name,
                  passengerEmail: email,
                  paymentId,
                }),
              });

              const data = await bookRes.json();

              if (!bookRes.ok) {
                setError(
                  data.error ||
                    "Booking failed after payment. Contact support.",
                );
                setLoading(false);
                reject();
                return;
              }

              router.push(`/confirm?ref=${data.referenceCode}`);
              resolve();
            } catch {
              setError("Something went wrong after payment.");
              setLoading(false);
              reject();
            }
          },

          modal: {
            ondismiss: () => {
              setLoading(false);
              reject(new Error("dismissed"));
            },
          },
        });

        rzp.open();
      });
    } catch (err: any) {
      if (err?.message !== "dismissed") {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30">
      <div className="absolute right-[-20%] top-[-10%] z-0 h-[120%] w-3/4 animate-slow-pan opacity-[0.03] pointer-events-none">
        <svg
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 100 1000 Q 500 100 1000 500"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-white"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-20">
        <Link
          href={`/seats?flightId=${flightId}`}
          className="text-xs uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors mb-10 flex items-center gap-2"
        >
          ← Back to Seats
        </Link>
        <h1 className="text-5xl font-serif font-light text-foreground mb-4">
          Complete Booking
        </h1>
        <p className="text-foreground/60 text-lg mb-12">
          Review your details and confirm your reservation.
        </p>

        {/* Flight Summary */}
        <div className="border border-white/10 bg-foreground/[0.02] p-8 relative mb-12 animate-[fade-in-up_0.4s_ease-out_both]">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/40" />

          <div className="flex items-center gap-2 mb-8">
            <span className="text-[10px] uppercase tracking-widest text-foreground/50">
              Flight
            </span>
            <span className="text-sm font-mono tracking-widest border border-white/10 px-2 py-1 bg-background text-foreground">
              {flightNumber}
            </span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-3xl font-light text-foreground">{origin}</p>
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">
                Origin
              </p>
            </div>
            <div className="flex-1 px-6 flex items-center gap-2 opacity-50">
              <div className="flex-1 h-px bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full border border-accent" />
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-light text-foreground">
                {destination}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">
                Destination
              </p>
            </div>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-6 mt-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                Seat
              </p>
              <p className="text-2xl font-light text-foreground">
                {seatNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                Price
              </p>
              <p className="text-2xl font-serif text-accent">
                ₹{price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8 animate-[fade-in-up_0.6s_ease-out_both]">
          <div>
            <label className="block text-[10px] text-foreground/40 mb-2 uppercase tracking-[0.2em]">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-transparent border-0 border-b border-white/20 text-foreground py-3 text-lg font-light focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/20"
            />
          </div>

          <div>
            <label className="block text-[10px] text-foreground/40 mb-2 uppercase tracking-[0.2em]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-transparent border-0 border-b border-white/20 text-foreground py-3 text-lg font-light focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/20"
            />
          </div>

          {error && (
            <div className="border border-red-900/50 bg-red-950/20 text-red-400 p-4 text-sm mt-4">
              {error}
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="shimmer-bg w-full inline-flex h-14 items-center justify-center rounded-full text-sm font-bold tracking-widest uppercase text-[#12100E] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(201,151,74,0.3)] disabled:opacity-50 disabled:pointer-events-none disabled:grayscale"
            >
              {loading ? "Processing..." : "Pay & Confirm Booking"}
            </button>
          </div>

          {/* Test mode helper */}
          <div className="border border-white/5 bg-foreground/[0.02] p-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-2">
              Test Mode — Use these details
            </p>
            <p className="text-xs text-foreground/50 font-mono">
              Card: 4100 2800 0000 1007
            </p>
            <p className="text-xs text-foreground/50 font-mono">
              Expiry: Any future date · CVV: Any 3 digits · OTP: 1234
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
