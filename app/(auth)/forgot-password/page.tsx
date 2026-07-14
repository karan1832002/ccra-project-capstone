"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [modal, setModal] = useState<{ show: boolean; title: string; message: string; showCreateAccount: boolean }>({
        show: false,
        title: "",
        message: "",
        showCreateAccount: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const trimmedEmail = email.trim().toLowerCase();

        const checkRes = await fetch("/api/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: trimmedEmail }),
        });
        const { exists } = await checkRes.json();

        if (!exists) {
            setLoading(false);
            setModal({
                show: true,
                title: "Something went wrong",
                message: "We couldn't find an account with that email address.",
                showCreateAccount: true,
            });
            return;
        }

        const { error } = await requestPasswordReset({
            email: trimmedEmail,
            redirectTo: "/reset-password",
        });

        if (error) {
            setLoading(false);
            setModal({
                show: true,
                title: "Something went wrong",
                message: error.message ?? "Please try again in a moment.",
                showCreateAccount: false,
            });
            return;
        }

        setLoading(false);
        setSent(true);
    };

    if (sent) {
        return (
            <div className="text-center py-8">
                <span className="material-symbols-outlined text-5xl text-[#933d04] mb-4 block">
                    mark_email_read
                </span>
                <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">
                    Check your email
                </h2>
                <p className="font-sans text-sm text-[#56433a]">
                    We've sent a password reset link to <strong>{email}</strong>.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="font-headline text-2xl font-bold text-[#705a49] mb-2">Forgot your password?</h2>
            <p className="font-sans text-sm text-[#56433a] mb-8">
                Enter your email and we'll send you a link to reset it.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider" htmlFor="forgot-email">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#897268]">
                            mail
                        </span>
                        <input
                            className="w-full pl-10 pr-4 py-3 rounded-lg input-bleached font-sans text-sm text-[#1e1b18]"
                            id="forgot-email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="mt-4 w-full bg-[#933d04] text-white font-semibold py-3.5 rounded-lg hover:bg-[#b3541e] transition active:scale-[0.98] cursor-pointer text-sm flex justify-center items-center gap-1 shadow-sm disabled:opacity-60"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Send Reset Link"}
                </button>

                <Link
                    href="/sign-in"
                    className="text-center text-xs font-bold text-[#0e6ab1] hover:underline mt-2"
                >
                    Back to Log In
                </Link>
            </form>

            {modal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl border border-[#e9e1dc]/50">
                        <span className="material-symbols-outlined text-5xl text-red-500 mb-4 block">
                            error
                        </span>
                        <h3 className="font-headline text-xl font-bold text-[#705a49] mb-2">
                            {modal.title}
                        </h3>
                        <p className="font-sans text-sm text-[#56433a] mb-6">
                            {modal.message}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setModal((m) => ({ ...m, show: false }))}
                                className="w-full bg-[#933d04] text-white font-semibold py-3 rounded-lg hover:bg-[#b3541e] transition active:scale-[0.98] cursor-pointer text-sm"
                            >
                                Try Again
                            </button>
                            {modal.showCreateAccount && (
                                <button
                                    onClick={() => router.push("/sign-up")}
                                    className="w-full bg-white text-[#933d04] font-semibold py-3 rounded-lg border border-[#933d04] hover:bg-[#fff3ec] transition active:scale-[0.98] cursor-pointer text-sm"
                                >
                                    Create Account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}