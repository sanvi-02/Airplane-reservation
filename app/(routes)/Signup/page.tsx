"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Background ko rich dark/black kiya hai
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      {/* Card ko dark grey/black background aur subtle gold border diya hai */}
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 p-8 shadow-2xl bg-[#121212] backdrop-blur-md">
        {/* Heading ko gradient gold text banaya hai */}
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-amber-400/90 text-sm tracking-wide">
              Name
            </label>
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-amber-400/90 text-sm tracking-wide">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-amber-400/90 text-sm tracking-wide">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button ko gold gradient aur hover effects diye hain */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold py-3 rounded-lg shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors ml-1">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
