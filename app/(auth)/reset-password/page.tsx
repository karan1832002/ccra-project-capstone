"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("This reset link is invalid or missing a token.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const { error } = await resetPassword({
            newPassword,
            token,
        });

        if (error) {
            setError(error.message ?? "This reset link is invalid or has expired.");
            setLoading(false);
            return;
        }

        setLoading(false);
        setSuccess(true);
        setTimeout(() => router.push("/sign-in"), 2000);
    };

    if (!token) {
        return (
            <div className="text-center py-8">
                <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">Invalid link</h2>
                <p className="font-sans text-sm text-[#56433a]">
                    This password reset link is missing or invalid. Please request a new one.
                </p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center py-8">
                <span className="material-symbols-outlined text-5xl text-[#933d04] mb-4 block">
                    check_circle
                </span>
                <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">Password updated</h2>
                <p className="font-sans text-sm text-[#56433a]">Redirecting you to sign in...</p>
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

            <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">Set a new password</h2>
            <p className="font-sans text-sm text-[#56433a] mb-8">Choose a new password for your account.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="new-password">
                        New Password
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897268]">
                            lock
                        </span>
                        <input
                            className="w-full pl-10 pr-10 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Min. 8 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#897268] hover:text-[#1e1b18] cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <input
                        className="w-full pl-4 pr-4 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    className="mt-4 w-full bg-[#933d04] text-white font-semibold py-3.5 rounded-lg hover:bg-[#b3541e] transition active:scale-[0.98] cursor-pointer text-sm flex justify-center items-center gap-1 shadow-sm disabled:opacity-60"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center py-8 text-sm text-[#56433a]">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}