"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedAuthContent from "./AnimatedAuthContent";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isSignIn = pathname === "/sign-in";
    const showTabs = pathname === "/sign-in" || pathname === "/sign-up";

    return (
        <main className="min-h-screen w-full flex flex-col md:flex-row bg-[#fff8f5] text-[#1e1b18] font-sans antialiased">
            {/* Left Side: Image/Branding (persistent, never remounts) */}
            <div
                className="hidden md:flex md:w-1/2 relative items-center justify-center overflow-hidden bg-[#705a49]"
                style={{
                    backgroundImage: "url('/images/auth-hero.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/35 z-0" />
                <div className="relative z-10 p-12 bg-white/40 backdrop-blur-md rounded-2xl max-w-md border border-white/20 shadow-2xl text-center text-white">
                    <h1 className="font-headline text-4xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                        CCRA Rodeo
                    </h1>
                    <p className="font-sans text-base font-medium text-stone-100 drop-shadow-sm">
                        Join the community. Track your events, manage entries, and follow the standings.
                    </p>
                </div>
            </div>

            {/* Right Side: Card shell (persistent) */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-[#fff8f5]">
                <div className="w-full max-w-[480px] bg-white rounded-2xl leather-shadow p-8 sm:p-10 relative border border-[#e9e1dc]/50 overflow-hidden">
                    <div className="md:hidden text-center mb-8">
                        <h1 className="font-headline text-3xl text-[#933d04] font-extrabold tracking-tight">
                            CCRA Rodeo
                        </h1>
                    </div>

                    {/* Tabs (persistent, animated underline) — only shown on sign-in / sign-up */}
                    {showTabs && (
                        <div className="flex gap-4 border-b border-[#e9e1dc] mb-8 relative">
                            <Link
                                href="/sign-in"
                                className={`flex-1 pb-3 font-semibold text-sm text-center transition-colors duration-300 ${isSignIn ? "text-[#933d04]" : "text-[#56433a] hover:text-[#933d04]"
                                    }`}
                            >
                                Log In
                            </Link>
                            <Link
                                href="/sign-up"
                                className={`flex-1 pb-3 font-semibold text-sm text-center transition-colors duration-300 ${!isSignIn ? "text-[#933d04]" : "text-[#56433a] hover:text-[#933d04]"
                                    }`}
                            >
                                Sign Up
                            </Link>
                            {/* Sliding underline indicator */}
                            <div
                                className="absolute bottom-0 h-[2px] bg-[#933d04] transition-transform duration-300 ease-out"
                                style={{
                                    width: "calc(50% - 8px)",
                                    transform: isSignIn ? "translateX(0%)" : "translateX(calc(100% + 16px))",
                                }}
                            />
                        </div>
                    )}

                    {/* Animated content area — height + fade transition handled here */}
                    <AnimatedAuthContent>{children}</AnimatedAuthContent>
                </div>
            </div>
        </main>
    );
}