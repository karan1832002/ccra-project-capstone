"use client";

import { useState, useTransition } from "react";
import type { Rodeo, RodeoDetail } from "@/lib/gateway";
import { removeRodeo, fetchRodeoDetail } from "./actions";
import ConfirmForm from "@/components/ui/ConfirmForm";
import RodeoForm from "./RodeoForm";
import EventManager from "./EventManager";

// Renders a nullable date string. Falls back to an em-dash when null.
function fmtDate(value: string | null) {
  if (!value) return "\u2014";
  return value;
}

// --- Rodeo Table ---
// Client component that receives the rodeo payload fetched by the parent
// server component and renders a responsive data table with row-level
// Edit Rodeo, Manage Events, and Delete controls.
//
// "Edit Rodeo" sets editingRodeo state and replaces the table with an
// inline RodeoForm pre-filled with that rodeo's data. Cancel or success
// clears the state and returns to the table.
//
// "Manage Events" sets managingRodeoId state and replaces the table with
// an EventManager bound to that rodeo. A "Back to Rodeo List" button
// clears the state and returns to the table.
//
// Delete wraps the removeRodeo server action in a ConfirmForm guard.
//
// Mobile (< sm): each row stacks as a labelled card with actions at the
//   bottom.
// Desktop (sm+): standard aligned-column table with thead headers and an
//   Actions column on the right.
export default function RodeoTable({ data }: { data: Rodeo[] }) {
  const [isPending, startTransition] = useTransition();

  // --- Inline view states ---
  // Only one of these is active at a time. The table is replaced by the
  // corresponding sub-component when either is non-null.

  // Editing a rodeo's metadata (title, location, dates, etc.).
  // Uses RodeoDetail so the form can pre-populate nested dates.
  const [editingRodeo, setEditingRodeo] = useState<RodeoDetail | null>(null);
  // Tracks whether a detail fetch is in-flight for the Edit button.
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Managing competition events (disciplines) for a specific rodeo.
  const [managingRodeoId, setManagingRodeoId] = useState<string | null>(
    null,
  );

  // --- RodeoForm (Edit Rodeo) mode ---
  if (editingRodeo) {
    return (
      <RodeoForm
        initialData={editingRodeo}
        onCancel={() => setEditingRodeo(null)}
        onSuccess={() => setEditingRodeo(null)}
      />
    );
  }

  // --- EventManager (Manage Events) mode ---
  if (managingRodeoId) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setManagingRodeoId(null)}
          className="inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-body-text transition hover:bg-highlight"
        >
          Back to Rodeo List
        </button>
        <EventManager rodeoId={managingRodeoId} />
      </div>
    );
  }

  // --- Table mode ---
  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="hidden sm:table-header-group bg-highlight">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
              Entry Fee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
              Entries Open
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
              Entries Close
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
              Capacity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((rodeo) => (
            <tr
              key={rodeo.id}
              className="block mb-6 border border-border p-4 rounded-md bg-surface sm:table-row sm:mb-0 sm:border-0 sm:p-0 sm:border-b sm:border-border sm:hover:bg-highlight"
            >
              <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm font-medium text-heading-text">
                <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                  Title
                </span>
                {rodeo.rodeoTitle}
              </td>
              <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm text-body-text">
                <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                  Location
                </span>
                {rodeo.location}
              </td>
              <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm text-body-text">
                <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                  Entry Fee
                </span>
                {rodeo.entryFee != null
                  ? `$${rodeo.entryFee.toFixed(2)}`
                  : "\u2014"}
              </td>
              <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm text-body-text">
                <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                  Entries Open
                </span>
                {fmtDate(rodeo.entriesOpen)}
              </td>
              <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm text-body-text">
                <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                  Entries Close
                </span>
                {fmtDate(rodeo.entriesClose)}
              </td>
              <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm text-body-text">
                <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                  Capacity
                </span>
                {rodeo.capacity ?? "\u2014"}
              </td>
              <td className="block sm:table-cell px-6 py-4 whitespace-nowrap">
                <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-2">
                  Actions
                </span>
                <div className="flex items-center gap-2">
                  {/* Opens the inline RodeoForm pre-filled with this
                      rodeo's data for editing metadata. */}

                  <button
                    type="button"
                    onClick={async () => {
                      setLoadingDetail(true);
                      try {
                        const detail = await fetchRodeoDetail(rodeo.id);
                        setEditingRodeo(detail);
                      } finally {
                        setLoadingDetail(false);
                      }
                    }}
                    disabled={loadingDetail}
                    className="inline-flex items-center rounded-md border border-border bg-accent px-3 py-1.5 text-xs font-medium text-accent-text transition hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    {loadingDetail ? "Loading..." : "Edit Rodeo"}
                  </button>

                  {/* Opens the inline EventManager for this rodeo,
                      replacing the table with the event management UI. */}

                  <button
                    type="button"
                    onClick={() => setManagingRodeoId(rodeo.id)}
                    className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/40"
                  >
                    Manage Events
                  </button>

                  {/* ConfirmForm intercepts the click with window.confirm
                      before delegating to the removeRodeo server action. */}

                  <ConfirmForm
                    action={() => {
                      startTransition(() => {
                        removeRodeo(rodeo.id);
                      });
                    }}
                    message={`Delete "${rodeo.rodeoTitle}"? This action cannot be undone.`}
                  >
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/40"
                    >
                      {isPending ? "Deleting..." : "Delete"}
                    </button>
                  </ConfirmForm>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}