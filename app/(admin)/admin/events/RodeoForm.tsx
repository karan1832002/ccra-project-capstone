"use client";

import { useState, useTransition, useEffect } from "react";
import { addRodeo, editRodeo } from "./actions";
import type { RodeoPayload, RodeoDatePayload } from "@/lib/gateway-client";
import type { Rodeo, RodeoDetail } from "@/lib/gateway";

// Standard rodeo competition categories recognized by the event-service.
// Exported so EventManager can reuse the same list.
export const CATEGORIES = [
  "Bareback",
  "Saddle Bronc",
  "Bull Riding",
  "Steer Wrestling",
  "Team Roping",
  "Tie-Down Roping",
  "Barrel Racing",
  "Breakaway Roping",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Empty rodeo date row used when adding a new date entry. */
const EMPTY_DATE: RodeoDatePayload = { date: "", startTime: "" };

interface RodeoFormProps {
  // When provided the form switches to edit mode: fields are pre-filled
  // from the existing rodeo and submission calls editRodeo instead of
  // addRodeo. When absent the form operates in create mode.
  initialData?: Rodeo | RodeoDetail | null;
  // Called when the user cancels out of edit mode so the parent can hide
  // the form and return to the table view.
  onCancel?: () => void;
  // Called after a successful edit so the parent can dismiss the form.
  onSuccess?: () => void;
}

// --- Rodeo Create / Edit Form ---
// Client-side form that collects rodeo metadata. In create mode (no
// initialData) it delegates persistence to addRodeo. In edit mode
// (initialData provided) it pre-fills all fields and delegates to
// editRodeo. A Cancel button is shown only in edit mode.
//
// State is initialised in a useEffect keyed on initialData so that the
// form correctly reacts when the parent swaps the rodeo being edited.
export default function RodeoForm({
  initialData,
  onCancel,
  onSuccess,
}: RodeoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [entriesOpen, setEntriesOpen] = useState("");
  const [entriesClose, setEntriesClose] = useState("");
  const [description, setDescription] = useState("");

  // Dynamic array of rodeo dates for multi-day events.
  const [rodeoDates, setRodeoDates] = useState<RodeoDatePayload[]>([]);

  const isEditing = Boolean(initialData);

  // Pre-fill form state whenever initialData changes (e.g. when the
  // user clicks Edit on a different row).
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(initialData.rodeoTitle);
      setLocation(initialData.location);
      setEntryFee(initialData.entryFee != null ? String(initialData.entryFee) : "");
      setEntriesOpen(initialData.entriesOpen ?? "");
      setEntriesClose(initialData.entriesClose ?? "");
      setDescription(initialData.description ?? "");

      // Hydrate existing dates from the rodeo detail response. The
      // RodeoDetail type nests `dates`; a plain Rodeo list item does
      // not expose dates so the array stays empty until the user
      // fetches the detail view.
      const existingDates = (initialData as RodeoDetail).dates;
      if (existingDates && existingDates.length > 0) {
        setRodeoDates(
          existingDates.map((d) => ({
            date: d.date,
            startTime: d.startTime ?? "",
          })),
        );
      } else {
        setRodeoDates([]);
      }
    } else {
      setTitle("");
      setLocation("");
      setEntryFee("");
      setEntriesOpen("");
      setEntriesClose("");
      setDescription("");
      setRodeoDates([]);
    }
    setError(null);
    setSuccess(null);
  }, [initialData]);

  // --- Rodeo Dates helpers ---

  function addDateRow() {
    setRodeoDates((prev) => [...prev, { ...EMPTY_DATE }]);
  }

  function removeDateRow(index: number) {
    setRodeoDates((prev) => prev.filter((_, i) => i !== index));
  }

  function updateDateRow(index: number, field: keyof RodeoDatePayload, value: string) {
    setRodeoDates((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  /**
   * Validates that every rodeo date occurs on or after entriesClose.
   * Returns an array of error messages (empty = valid).
   *
   * Compares YYYY-MM-DD strings lexicographically, which is reliable
   * for ISO-8601 date strings in the same calendar era.
   */
  function validateDates(): string[] {
    const errors: string[] = [];
    if (!entriesClose || rodeoDates.length === 0) return errors;

    for (let i = 0; i < rodeoDates.length; i++) {
      const row = rodeoDates[i];
      if (!row.date) {
        errors.push(`Date row ${i + 1}: date is required.`);
        continue;
      }
      if (!row.startTime) {
        errors.push(`Date row ${i + 1}: start time is required.`);
        continue;
      }
      if (row.date < entriesClose) {
        errors.push(
          `Date row ${i + 1} (${row.date}) is before entries close (${entriesClose}).`,
        );
      }
    }

    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Run client-side validation on dates before submitting.
    const dateErrors = validateDates();
    if (dateErrors.length > 0) {
      setError(dateErrors.join("\n"));
      return;
    }

    startTransition(async () => {
      try {
        const payload: RodeoPayload = {
          rodeoTitle: title.trim(),
          location: location.trim(),
          entryFee: entryFee ? parseFloat(entryFee) : null,
          entriesOpen: entriesOpen || null,
          entriesClose: entriesClose || null,
          description: description.trim() || null,
          rodeoDates: rodeoDates.length > 0 ? rodeoDates : undefined,
        };

        if (isEditing && initialData) {
          await editRodeo(initialData.id, payload);
          setSuccess("Rodeo updated successfully.");
          onSuccess?.();
        } else {
          await addRodeo(payload);
          setTitle("");
          setLocation("");
          setEntryFee("");
          setEntriesOpen("");
          setEntriesClose("");
          setDescription("");
          setRodeoDates([]);
          setSuccess("Rodeo created successfully.");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to save rodeo.",
        );
      }
    });
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {isEditing ? "Edit Rodeo" : "Create New Rodeo"}
      </h2>

      {/* --- Feedback Banners --- */}
      {error && (
        <div className="mb-6 whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* --- Rodeo Title --- */}
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

          {/* --- Location --- */}
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

          {/* --- Entry Fee --- */}
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

          {/* --- Entries Open Date --- */}
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

          {/* --- Entries Close Date --- */}
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

        {/* --- Rodeo Dates --- */}
        <fieldset className="rounded-md border border-gray-200 p-4">
          <legend className="px-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            Rodeo Dates
          </legend>

          {rodeoDates.length === 0 && (
            <p className="mb-3 text-sm text-gray-400">
              No dates added. A rodeo with no dates will use the entries window as its date range.
            </p>
          )}

          <div className="space-y-3">
            {rodeoDates.map((row, index) => (
              <div
                key={index}
                className="flex flex-wrap items-end gap-3 rounded-md border border-gray-100 bg-gray-50 p-3"
              >
                {/* Date */}
                <div className="flex-1 min-w-[160px]">
                  <label
                    htmlFor={`date-${index}`}
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Date
                  </label>
                  <input
                    id={`date-${index}`}
                    type="date"
                    required
                    value={row.date}
                    onChange={(e) => updateDateRow(index, "date", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Start Time */}
                <div className="flex-1 min-w-[140px]">
                  <label
                    htmlFor={`time-${index}`}
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    id={`time-${index}`}
                    type="time"
                    required
                    value={row.startTime}
                    onChange={(e) => updateDateRow(index, "startTime", e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeDateRow(index)}
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  aria-label={`Remove date row ${index + 1}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add date button */}
          <button
            type="button"
            onClick={addDateRow}
            className="mt-3 inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Date
          </button>
        </fieldset>

        {/* --- Description Textarea --- */}
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

        <div className="flex justify-end gap-3">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center rounded-md border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {isPending
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Changes"
                : "Create Rodeo"}
          </button>
        </div>
      </form>
    </div>
  );
}