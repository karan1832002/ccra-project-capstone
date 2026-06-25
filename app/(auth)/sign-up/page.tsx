"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error } = await signUp.email({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError(error.message ?? "Failed to create account.");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="relative min-h-screen bg-stone-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-stone-400">
            Join CCRA and access member features.
          </p>

          <form onSubmit={handleSignUp} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-300">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-lg border border-white/10 bg-white/10 px-3 text-white outline-none focus:border-orange-500"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-lg border border-white/10 bg-white/10 px-3 text-white outline-none focus:border-orange-500"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-lg border border-white/10 bg-white/10 px-3 text-white outline-none focus:border-orange-500"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 rounded-lg bg-orange-600 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-orange-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}