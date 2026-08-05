import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { fetchRodeos } from "./actions";
import type { Rodeo } from "@/lib/gateway";
import RodeoForm from "./RodeoForm";
import RodeoTable from "./RodeoTable";

// --- Events Management Page ---
// Server component available to both admin and superadmin roles (the
// layout already gates at the "admin" level). Fetches all rodeos from the
// event-service gateway and passes them as props to the client-side
// RodeoTable. A fetch failure renders an error banner instead of crashing
// the page so the admin form remains usable for diagnosis.
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
    <div className="space-y-6 p-4 md:p-8 bg-gray-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage rodeos, dates, draws, and event details.
          </p>
        </div>
      </div>

      {/* --- Rodeo Creation Form --- */}
      <RodeoForm />

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
        <RodeoTable data={rodeos} />
      )}
    </div>
  );
}