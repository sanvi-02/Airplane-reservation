// app/(routes)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!name || !email || !password || !confirm) {
      setError("Sab fields bharo.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords match nahi kar rahe.");
      return;
    }
    if (password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "signup", name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Signup failed");
      } else {
        router.push("/search");
      }
    } catch {
      setError("Kuch problem hui. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-white tracking-tight">
            ✈ SkyBook
          </span>
          <p className="text-slate-400 text-sm mt-1">Apna account banao</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Sign Up</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anshika Jain"
                className="w-full bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-slate-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-slate-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-slate-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className="w-full bg-slate-800 border border-slate-600 focus:border-blue-500 focus:outline-none text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-slate-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2.5 rounded-xl transition-colors mt-1">
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already Have Account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium">
              Login 
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
