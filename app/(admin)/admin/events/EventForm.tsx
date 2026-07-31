"use client";

import { useState, useTransition } from "react";
import { addRodeo } from "./actions";
import type { RodeoPayload } from "@/lib/gateway-client";

const CATEGORIES = [
  "Bareback",
  "Saddle Bronc",
  "Bull Riding",
  "Steer Wrestling",
  "Team Roping",
  "Tie-Down Roping",
  "Barrel Racing",
  "Breakaway Roping",
] as const;

// Client component that renders a form for creating a new rodeo
// and optionally adding initial competition events to it.
// Submits through a server action that calls the event-service gateway.
export default function EventForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Rodeo fields
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [entriesOpen, setEntriesOpen] = useState("");
  const [entriesClose, setEntriesClose] = useState("");
  const [description, setDescription] = useState("");
  const [phoneInEntries, setPhoneInEntries] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const payload: RodeoPayload = {
          rodeoTitle: title.trim(),
          location: location.trim(),
          entryFee: entryFee ? parseFloat(entryFee) : null,
          entriesOpen: entriesOpen || null,
          entriesClose: entriesClose || null,
          description: description.trim() || null,
          phoneInEntries: phoneInEntries.trim() || null,
        };

        await addRodeo(payload);

        // Reset form fields on success
        setTitle("");
        setLocation("");
        setEntryFee("");
        setEntriesOpen("");
        setEntriesClose("");
        setDescription("");
        setPhoneInEntries("");
        setSuccess("Rodeo created successfully.");
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to create rodeo.",
        );
      }
    });
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Create New Rodeo
      </h2>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Title */}
          <div>
            <label
              htmlFor="rodeo-title"
              className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1"
            >
              Rodeo Title
            </label>
            <input
              id="rodeo-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Spring Classic Rodeo"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="rodeo-location"
              className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1"
            >
              Location
            </label>
            <input
              id="rodeo-location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="City, Province"
            />
          </div>

          {/* Entry Fee */}
          <div>
            <label
              htmlFor="rodeo-fee"
              className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1"
            >
              Entry Fee ($)
            </label>
            <input
              id="rodeo-fee"
              type="number"
              step="0.01"
              min="0"
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="50.00"
            />
          </div>

          {/* Phone-in entries */}
          <div>
            <label
              htmlFor="rodeo-phone"
              className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1"
            >
              Phone-In Entries
            </label>
            <input
              id="rodeo-phone"
              type="text"
              value={phoneInEntries}
              onChange={(e) => setPhoneInEntries(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Entries Open */}
          <div>
            <label
              htmlFor="rodeo-open"
              className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1"
            >
              Entries Open
            </label>
            <input
              id="rodeo-open"
              type="date"
              value={entriesOpen}
              onChange={(e) => setEntriesOpen(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Entries Close */}
          <div>
            <label
              htmlFor="rodeo-close"
              className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1"
            >
              Entries Close
            </label>
            <input
              id="rodeo-close"
              type="date"
              value={entriesClose}
              onChange={(e) => setEntriesClose(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="rodeo-desc"
            className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1"
          >
            Description
          </label>
          <textarea
            id="rodeo-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Brief description of the rodeo..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Rodeo"}
          </button>
        </div>
      </form>
    </div>
  );
}