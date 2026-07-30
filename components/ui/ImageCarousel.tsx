"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number; // ms
  showCaptions?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "wide"; // 16/9, 1/1, 21/9
}

export default function ImageCarousel({
  images,
  autoPlay = true,
  interval = 5000,
  showCaptions = true,
  className = "",
  aspectRatio = "video",
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered || images.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, next, images.length]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  if (!images.length) return null;

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "wide"
      ? "aspect-[21/9]"
      : "aspect-video";

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-900 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className={`relative ${aspectClass}`}>
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority={index === 0}
            />
            {/* Gradient for caption readability */}
            {showCaptions && img.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            )}
          </div>
        ))}
      </div>

      {/* Caption */}
      {showCaptions && images[current]?.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-sm sm:text-base font-medium drop-shadow-md">
            {images[current].caption}
          </p>
        </div>
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100 shadow-sm flex items-center justify-center transition hover:bg-white dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100 shadow-sm flex items-center justify-center transition hover:bg-white dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                index === current
                  ? "bg-orange-600 scale-110"
                  : "bg-white/70 hover:bg-white dark:bg-stone-400 dark:hover:bg-stone-200"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}