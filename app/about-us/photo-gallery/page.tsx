"use client";

import React, { useState } from "react";
import Image from "next/image";
import ImageCarousel, { CarouselImage } from "@/components/ui/ImageCarousel";

const galleryImages: CarouselImage[] = [
  {
    src: "/images/gallery/rodeo-1.jpg",
    alt: "Barrel racing action",
    caption: "Ladies Barrel Racing – 2025 Finals",
  },
  {
    src: "/images/gallery/rodeo-2.jpg",
    alt: "Team roping",
    caption: "Team Roping – Magrath CCRA Rodeo",
  },
  {
    src: "/images/gallery/rodeo-3.jpg",
    alt: "Steer wrestling",
    caption: "Steer Wrestling – Championship Round",
  },
  {
    src: "/images/gallery/rodeo-4.jpg",
    alt: "Crowd and arena",
    caption: "Fans enjoying the action at the CCRA Finals",
  },
  {
    src: "/images/gallery/rodeo-5.jpg",
    alt: "Breakaway roping",
    caption: "Men’s Breakaway – 2025 Season",
  },
];

// simple grid images (you can expand this list)
const gridImages = [
  { src: "/images/gallery/grid-1.jpg", alt: "Ribbon roping" },
  { src: "/images/gallery/grid-2.jpg", alt: "Arena setup" },
  { src: "/images/gallery/grid-3.jpg", alt: "Awards ceremony" },
  { src: "/images/gallery/grid-4.jpg", alt: "Competitors preparing" },
  { src: "/images/gallery/grid-5.jpg", alt: "Stock in the pens" },
  { src: "/images/gallery/grid-6.jpg", alt: "Crowd cheering" },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-orange-50 px-4 py-1 text-sm font-semibold text-orange-600 mb-6 dark:bg-orange-950/40 dark:text-orange-400">
            MEMORIES
          </div>
          <h1 className="text-5xl font-semibold text-stone-950 tracking-tight mb-6 dark:text-stone-100">
            Photo Gallery
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300">
            Relive the excitement of Canadian Classic Rodeo – from the arena to the awards.
          </p>
        </div>

        {/* Featured Carousel */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-stone-950 mb-6 dark:text-stone-100">
            Featured Moments
          </h2>
          <ImageCarousel
            images={galleryImages}
            autoPlay={true}
            interval={4500}
            showCaptions={true}
            aspectRatio="video"
          />
        </section>

        {/* Photo Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-stone-950 mb-6 dark:text-stone-100">
            More from the Season
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gridImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img.src)}
                className="relative aspect-square overflow-hidden rounded-md border border-stone-200 bg-stone-100 transition hover:shadow-lg hover:-translate-y-0.5 dark:border-stone-700 dark:bg-stone-900"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Simple Lightbox for grid images */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full aspect-video rounded-md overflow-hidden">
              <Image
                src={selectedImage}
                alt="Enlarged gallery image"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-md bg-white/90 dark:bg-stone-900/90 flex items-center justify-center text-stone-800 dark:text-stone-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}