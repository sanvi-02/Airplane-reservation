"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/signup");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="pb-1 text-sm uppercase tracking-widest text-zinc-400 transition-colors hover:text-amber-400 cursor-pointer"
    >
      {loading ? "..." : "Logout"}
    </button>
  );
}
