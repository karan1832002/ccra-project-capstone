"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";
import { updateUser } from "@/lib/auth-client";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      if (selectedFile) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(selectedFile);
        });
      }

      await updateUser({
        name: name.trim() || undefined,
        image: imageUrl,
      });

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setName(user.name);
    setSelectedFile(null);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-md border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-700 dark:bg-stone-900">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-md p-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-stone-950 dark:text-stone-100 mb-6">
          Edit Profile
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="edit-name"
              className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5"
            >
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-950 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-600"
              placeholder="Your name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5"
            >
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-md border border-stone-200 bg-stone-100 px-3 py-2 text-sm text-stone-600 cursor-not-allowed dark:border-stone-700 dark:bg-stone-800 dark:text-stone-600"
            />
            <p className="mt-1 text-xs text-stone-600 dark:text-stone-600">
              Email changes require verification via account settings.
            </p>
          </div>

          {/* Avatar / Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Profile Picture
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Upload className="w-4 h-4" />
              {selectedFile ? selectedFile.name : "Choose image..."}
            </button>
            {selectedFile && (
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-600">
                {Math.round(selectedFile.size / 1024)} KB
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-stone-50 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}