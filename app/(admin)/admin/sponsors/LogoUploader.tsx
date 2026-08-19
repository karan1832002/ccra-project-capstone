"use client";

import { useState, useRef, useCallback, type DragEvent, type ClipboardEvent } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface LogoUploaderProps {
  defaultLogo?: string;
  name?: string;
}

export default function LogoUploader({ defaultLogo = "", name = "logo" }: LogoUploaderProps) {
  const [preview, setPreview] = useState<string>(defaultLogo);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "sponsor_logo");

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? json?.error ?? "Upload failed");
      }

      const blobUrl: string = json.data?.blobUrl ?? json.blobUrl ?? json.url ?? "";
      if (!blobUrl) throw new Error("No URL returned from upload");

      setPreview(blobUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  }

  function clearLogo() {
    setPreview("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file);
  }

  function handlePaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) uploadFile(file);
        return;
      }
    }
  }

  return (
    <div onPaste={handlePaste}>
      <label className="block text-sm font-medium text-body-text">
        Logo
      </label>

      <input type="hidden" name={name} value={preview} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        id="logo-upload"
      />

      {preview ? (
        <div className="mt-1 flex items-start gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-highlight">
            <Image
              src={preview}
              alt="Logo preview"
              fill
              unoptimized
              className="object-contain p-1"
              sizes="80px"
            />
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={clearLogo}
              className="inline-flex items-center gap-1 text-xs font-medium text-body-text hover:text-red-600 transition-colors dark:hover:text-red-400"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
            <label
              htmlFor="logo-upload"
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-accent-text hover:text-accent-text transition-colors"
            >
              <Upload className="h-3 w-3" />
              Replace
            </label>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-1 flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors ${
            dragOver
              ? "border-primary bg-accent"
              : "border-border bg-highlight hover:border-primary"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-body-text">
              <Loader2 className="h-8 w-8 animate-spin text-accent-text" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-body-text" />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer text-sm font-medium text-accent-text hover:text-accent-text"
              >
                Click to upload
              </label>
              <p className="mt-1 text-xs text-body-text">
                or drag and drop, or paste from clipboard
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}