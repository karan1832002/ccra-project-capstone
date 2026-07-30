"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { Image as ImageIcon, X } from "lucide-react";

// Media item structure
interface MediaItem {
  id: string;
  fileName: string;
  blobUrl: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);

  // Fetch live photos from database API
  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/media?category=event_photo");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPhotos(json.data);
        }
      } catch (err) {
        console.error("Gallery fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Format slides for carousel
  const carouselSlides = photos.map((p) => ({
    src: p.blobUrl,
    alt: p.fileName,
    caption: p.fileName.replace(/^\d+-/, "").replace(/\.[^/.]+$/, ""),
  }));

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center pt-8 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 mb-6 dark:bg-orange-950/50 dark:text-orange-400">
            Official Rodeo Media
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-950 tracking-tight mb-6 dark:text-stone-100">
            Photo Gallery
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300">
            Relive the action, grit, and unforgettable moments from the Canadian Classic Rodeo Association season.
          </p>
        </div>

        {/* Featured Slideshow */}
        {photos.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-stone-950 mb-6 dark:text-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-orange-600 rounded-full inline-block" />
              Featured Highlights
            </h2>
            <ImageCarousel images={carouselSlides} autoPlay interval={4500} showCaptions aspectRatio="video" />
          </section>
        )}

        {/* Main Photo Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-stone-950 dark:text-stone-100 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-orange-600" />
              Rodeo Season Collection
            </h2>
            {photos.length > 0 && (
              <span className="text-xs font-semibold px-3 py-1 bg-stone-200 text-stone-700 rounded-full dark:bg-stone-800 dark:text-stone-300">
                {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
              </span>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="py-20 text-center text-stone-500 font-medium">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mb-3" />
              <div>Loading gallery collection...</div>
            </div>
          ) : photos.length === 0 ? (
            /* Empty state */
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-12 text-center dark:border-stone-800 dark:bg-stone-900/50">
              <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-stone-800 dark:text-stone-200 mb-1">
                No photos in gallery yet
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                Check back soon as new event action shots are added throughout the season.
              </p>
            </div>
          ) : (
            /* Photo Grid List */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((item) => {
                const displayName = item.fileName.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "");
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPhoto(item)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900 cursor-pointer"
                  >
                    <Image
                      src={item.blobUrl}
                      alt={displayName}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-stone-300 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Lightbox Image Preview Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.blobUrl}
                alt={selectedPhoto.fileName}
                fill
                unoptimized
                className="object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition shadow-lg backdrop-blur-sm"
                aria-label="Close preview"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                <p className="text-base font-semibold">
                  {selectedPhoto.fileName.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "")}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Added on{" "}
                  {new Date(selectedPhoto.createdAt).toLocaleDateString("en-CA", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}