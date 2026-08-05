"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Sponsor = {
  id?: string | number;
  src: string;
  alt: string;
  href?: string;
};

interface SponsorsCarouselProps {
  sponsors: Sponsor[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export default function SponsorsCarousel({
  sponsors,
  autoPlay = true,
  interval = 3500,
  className = "",
}: SponsorsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % sponsors.length);
  }, [sponsors.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + sponsors.length) % sponsors.length);
  }, [sponsors.length]);

  useEffect(() => {
    if (!autoPlay || isHovered || sponsors.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, next, sponsors.length]);

  if (!sponsors.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md text-sm text-stone-300">
        No sponsors yet
      </div>
    );
  }

  const sponsor = sponsors[current];

  const Logo = (
    <div className="relative h-full w-full p-8 sm:p-10">
      <Image
        src={sponsor.src}
        alt={sponsor.alt}
        fill
        unoptimized
        className="object-contain drop-shadow-lg"
        sizes="(max-width: 768px) 100vw, 500px"
        priority={current === 0}
      />
    </div>
  );

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo area */}
      <div className="relative aspect-[2/1] overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
        {sponsor.href ? (
          <Link
            href={sponsor.href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 block transition hover:opacity-90"
            aria-label={sponsor.alt}
          >
            {Logo}
          </Link>
        ) : (
          <div className="absolute inset-0">{Logo}</div>
        )}
      </div>

      {/* Controls under the logo: prev · dots · next */}
      {sponsors.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-stone-950/50 text-white backdrop-blur-sm transition hover:bg-stone-950/70 focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Previous sponsor"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 rounded-full bg-stone-950/55 px-3 py-2 backdrop-blur-sm">
            {sponsors.map((s, index) => (
              <button
                key={s.id ?? index}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  index === current
                    ? "scale-125 bg-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.45)]"
                    : "bg-white/90 hover:bg-white"
                }`}
                aria-label={`Go to ${s.alt}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-stone-950/50 text-white backdrop-blur-sm transition hover:bg-stone-950/70 focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Next sponsor"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}