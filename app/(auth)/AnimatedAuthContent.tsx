"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function AnimatedAuthContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const innerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        const el = innerRef.current;
        if (!el) return;

        const updateHeight = () => {
            setHeight(el.getBoundingClientRect().height);
        };

        // Measure immediately on mount / route change
        updateHeight();

        // Keep watching for ANY content size change afterward (errors, validation text, etc.)
        const observer = new ResizeObserver(() => {
            updateHeight();
        });

        observer.observe(el);

        return () => observer.disconnect();
    }, [pathname]);

    return (
        <div
            style={{
                height: height !== undefined ? `${height}px` : "auto",
                transition: "height 0.35s ease",
                overflow: "hidden",
            }}
        >
            <div ref={innerRef} key={pathname} className="auth-fade-in">
                {children}
            </div>
        </div>
    );
}