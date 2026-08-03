import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { fetchRodeos } from "./actions";
import type { Rodeo } from "@/lib/gateway";
import EventForm from "./EventForm";

// Renders a nullable date string. Falls back to an em-dash when null.
function fmtDate(value: string | null) {
  if (!value) return "\u2014";
  return value;
}

// --- Events Management Page ---
// Server component available to both admin and superadmin roles (the
// layout already gates at the "admin" level). Fetches all rodeos from the
// event-service gateway and renders them in a read-only table alongside
// the rodeo creation form. A fetch failure renders an error banner instead
// of crashing the page so the admin form remains usable for diagnosis.
export default async function AdminEventsPage() {
  await requireAdmin();

  let rodeos: Rodeo[] | null = null;
  let fetchError: string | null = null;

  try {
    rodeos = await fetchRodeos();
  } catch (error: unknown) {
    fetchError =
      error instanceof Error ? error.message : "Failed to load rodeos.";
  }

  return (
    <div className="space-y-6 p-8 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage rodeos, dates, draws, and event details.
        </p>
      </div>

      {/* --- Rodeo Creation Form --- */}
      <EventForm />

      {/* --- Rodeo List Table --- */}
      {fetchError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-800">
            Could not load rodeos.
          </p>
          <p className="mt-1 text-sm text-red-600">{fetchError}</p>
        </div>
      ) : !rodeos || rodeos.length === 0 ? (
        <p className="text-sm text-gray-500">No rodeos found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Entry Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Entries Open
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Entries Close
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Capacity
                </th>
              </tr>
            </thead>
            <tbody>
              {rodeos.map((rodeo) => (
                <tr
                  key={rodeo.id}
                  className="border-b border-gray-100 bg-white transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rodeo.rodeoTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {rodeo.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {rodeo.entryFee != null
                      ? `$${rodeo.entryFee.toFixed(2)}`
                      : "\u2014"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {fmtDate(rodeo.entriesOpen)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {fmtDate(rodeo.entriesClose)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {rodeo.capacity ?? "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}