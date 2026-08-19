"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed.");
      }

      router.push("/admin/emails");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0C10] px-4 text-[#E2E8F0]">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00E5E5"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white">Admin Access</h1>
        <p className="mt-1 text-sm text-white/50">
          Enter the admin password to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-white/50"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white outline-none transition-colors duration-200 focus:border-[#00E5E5]"
              placeholder="••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full rounded-full bg-[#00E5E5] px-6 py-3 font-semibold text-black transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {isSubmitting ? "Checking..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}