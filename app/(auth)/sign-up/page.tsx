"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (signupPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setLoading(true);

    const { error } = await signUp.email({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
      callbackURL: "/verify-email",
    });

    if (error) {
      console.error("BETTER AUTH RAW ERROR:", error);
      setError(error.message ?? "Failed to create account.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setVerificationSent(true);
  };

  if (verificationSent) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-outlined text-5xl text-[#933d04] mb-4 block">
          mark_email_read
        </span>
        <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">
          Check your email
        </h2>
        <p className="font-sans text-sm text-[#56433a]">
          We sent a verification link to <strong>{signupEmail}</strong>. Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">Join the Association</h2>
      <p className="font-sans text-sm text-[#56433a] mb-8">Create an account to start managing your entries.</p>

      <form onSubmit={handleSignUp} className="flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="signup-first">
              First Name
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
              id="signup-first"
              type="text"
              required
              placeholder="First"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="signup-last">
              Last Name
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
              id="signup-last"
              type="text"
              required
              placeholder="Last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="signup-email">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897268]">
              mail
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
              id="signup-email"
              type="email"
              required
              placeholder="rider@example.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="signup-password">
            Create Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897268]">
              lock
            </span>
            <input
              className="w-full pl-10 pr-10 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
              id="signup-password"
              type={showSignupPassword ? "text" : "password"}
              required
              placeholder="Min. 8 characters"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword(!showSignupPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#897268] hover:text-[#1e1b18] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showSignupPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 mt-1">
          <input
            className="h-4 w-4 mt-0.5 rounded border-gray-300 text-[#933d04] focus:ring-[#933d04]"
            id="terms"
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <label className="text-xs text-[#56433a] leading-relaxed cursor-pointer select-none" htmlFor="terms">
            I agree to the <Link href="/terms-of-service" className="text-blue-400 underline font-semibold">Terms of Service</Link> and{" "}
            <Link href="/privacy-policy" className="text-blue-400 underline font-semibold">Privacy Policy</Link>.
          </label>
        </div>

        <button
          className="mt-4 w-full bg-[#933d04] text-white font-semibold py-3.5 rounded-lg hover:bg-[#b3541e] transition active:scale-[0.98] cursor-pointer text-sm flex justify-center items-center gap-1 shadow-sm disabled:opacity-60"
          type="submit"
          disabled={loading || !agreeTerms}
        >
          {loading ? "Creating..." : "Create Account"}
          <span className="material-symbols-outlined text-sm font-bold">how_to_reg</span>
        </button>
      </form>
    </div>
  );
}