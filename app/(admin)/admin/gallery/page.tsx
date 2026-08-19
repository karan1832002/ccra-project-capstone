"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Trash2, Upload, Loader2 } from "lucide-react";

// One photo record from media-service (category "event_photo").
interface MediaItem {
  id: string;
  fileName: string;
  blobUrl: string;
  createdAt: string;
}

const CATEGORY = "event_photo";

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all photos in this category from the gallery.
  async function loadPhotos() {
    try {
      const res = await fetch(`/api/media?category=${CATEGORY}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setPhotos(json.data);
    } catch {
      setError("Could not load the gallery.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Standard client-side data fetch on mount. loadPhotos setStates only after
    // an await, so the "set-state-in-effect" warning is a false positive here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPhotos();
  }, []);

  // Upload the chosen file, then refresh the list.
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", CATEGORY);

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? json?.error ?? "Upload failed");
      }
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // allow re-selecting the same file
    }
  }

  // Delete a photo, then drop it from the list.
  async function handleDelete(id: string) {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? json?.error ?? "Delete failed");
      }
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-heading-text">Photo Gallery</h1>
          <p className="mt-1 text-sm text-body-text">
            Upload and manage the public photo gallery images.
          </p>
        </div>

        {/* Upload button (hidden file input) */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="gallery-upload"
          />
          <label
            htmlFor="gallery-upload"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-primary-dark ${
              uploading ? "pointer-events-none opacity-70" : ""
            }`}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload Photo"}
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Photo grid */}
      <div className="mt-8">
        {loading ? (
          <div className="py-20 text-center text-body-text">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-accent-text" />
            Loading gallery...
          </div>
        ) : photos.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-surface/60 p-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-body-text" />
            <h3 className="mb-1 text-lg font-semibold text-heading-text">No photos yet</h3>
            <p className="mx-auto max-w-md text-sm text-body-text">
              Use &quot;Upload Photo&quot; above to add the first image to the gallery.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs font-semibold text-caption-text">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((item) => {
                const displayName = item.fileName.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "");
                return (
                  <div
                    key={item.id}
                    className="group relative aspect-square overflow-hidden rounded-md border border-border bg-highlight shadow-sm"
                  >
                    <Image
                      src={item.blobUrl}
                      alt={displayName}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100 disabled:opacity-100"
                      aria-label={`Delete ${displayName}`}
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                      <p className="truncate text-xs font-medium">{displayName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
