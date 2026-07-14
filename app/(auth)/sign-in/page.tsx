"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn.email({
      email: loginEmail.trim().toLowerCase(),
      password: loginPassword,
    });

    if (error) {
      const message = error.message?.toLowerCase() ?? "";

      if (message.includes("verify") || message.includes("verification")) {
        setError("Please verify your email before signing in — check your inbox for the link.");
      } else if (message.includes("invalid") || message.includes("credentials")) {
        setError("Incorrect email or password.");
      } else {
        setError(error.message ?? "Failed to sign in.");
      }

      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">Welcome Back</h2>
      <p className="font-sans text-sm text-[#56433a] mb-8">Enter your details to sign in.</p>

      <form onSubmit={handleSignIn} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="login-email">
            Email Address
          </label>
          <input
            className="w-full pl-4 pr-4 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
            id="login-email"
            type="email"
            required
            placeholder="Enter your email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="login-password">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-bold text-[#0e6ab1] cursor-pointer underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              className="w-full pl-4 pr-10 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
              id="login-password"
              type={showLoginPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#897268] hover:text-[#1e1b18] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showLoginPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>

        <button
          className="mt-4 w-full bg-[#933d04] text-white font-semibold py-3.5 rounded-lg hover:bg-[#b3541e] transition active:scale-[0.98] cursor-pointer text-sm flex justify-center items-center gap-1 shadow-sm disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}