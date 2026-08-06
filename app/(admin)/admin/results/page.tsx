import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { fetchUsers, fetchRodeosAndEvents } from "./actions";
import ResultsForm from "./ResultsForm";

// --- Admin Results Management Page ---
// Server component gated behind the admin role. Pre-fetches the user list
// from the local auth database and the rodeo + event lists from the
// event-service gateway, then passes both as props to the client-side
// ResultsForm so the admin can select from human-readable dropdowns
// instead of typing UUIDs.

export default async function AdminResultsPage() {
  await requireAdmin();

  let users: { id: string; name: string }[] = [];
  let rodeos: import("@/lib/gateway").Rodeo[] = [];
  let events: import("@/lib/gateway").Event[] = [];
  let fetchError: string | null = null;

  try {
    [users, { rodeos, events }] = await Promise.all([
      fetchUsers(),
      fetchRodeosAndEvents(),
    ]);
  } catch (error: unknown) {
    fetchError =
      error instanceof Error ? error.message : "Failed to load reference data.";
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Rodeo Results</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit official results for completed rodeo events. Select a
          rodeo, event, and competitor from the dropdowns below.
        </p>
      </div>

      {fetchError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-800">
            Could not load reference data.
          </p>
          <p className="mt-1 text-sm text-red-600">{fetchError}</p>
        </div>
      ) : (
        <ResultsForm users={users} rodeos={rodeos} events={events} />
      )}
    </div>
  );
}