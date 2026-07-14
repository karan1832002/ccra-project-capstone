"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fff8f5] px-6">
                <div className="w-full max-w-md bg-white rounded-2xl leather-shadow p-10 text-center border border-[#e9e1dc]/50">
                    <span className="material-symbols-outlined text-5xl text-red-500 mb-4 block">
                        error
                    </span>
                    <h1 className="font-headline text-2xl font-bold text-[#705a49] mb-2">
                        Verification link invalid
                    </h1>
                    <p className="font-sans text-sm text-[#56433a] mb-8">
                        This link may have expired or already been used. Please try signing up or logging in again.
                    </p>
                    <Link
                        href="/sign-in"
                        className="inline-block w-full bg-[#933d04] text-white font-semibold py-3.5 rounded-lg hover:bg-[#b3541e] transition active:scale-[0.98] text-sm"
                    >
                        Back to Log In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff8f5] px-6">
            <div className="w-full max-w-md bg-white rounded-2xl leather-shadow p-10 text-center border border-[#e9e1dc]/50">
                <span className="material-symbols-outlined text-5xl text-[#933d04] mb-4 block">
                    check_circle
                </span>
                <h1 className="font-headline text-2xl font-bold text-[#705a49] mb-2">
                    Email verified!
                </h1>
                <p className="font-sans text-sm text-[#56433a] mb-8">
                    Your account is now active. You can log in to CCRA Rodeo.
                </p>
                <Link
                    href="/sign-in"
                    className="inline-block w-full bg-[#933d04] text-white font-semibold py-3.5 rounded-lg hover:bg-[#b3541e] transition active:scale-[0.98] text-sm"
                >
                    Log In
                </Link>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#fff8f5] text-sm text-[#56433a]">
                    Loading...
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}