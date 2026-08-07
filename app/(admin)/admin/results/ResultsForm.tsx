"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addRodeoResult, fetchEventRegistrations } from "./actions";
import type { Rodeo, Event } from "@/lib/gateway";

// ==========================================================================
// TYPES
// ==========================================================================

type FormState = { error: string | null; success: boolean };

export interface UserOption {
  id: string;
  name: string;
}

/** A competitor registration record returned by the server action. */
interface CompetitorEntry {
  entryId: string;
  userId: string;
  competitorName: string;
}

interface ResultsFormProps {
  users: UserOption[];
  rodeos: Rodeo[];
  events: Event[];
}

const initialState: FormState = { error: null, success: false };

// ==========================================================================
// SUBMIT BUTTON (uses useFormStatus for pending state)
// ==========================================================================

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-orange-600 text-white font-semibold px-4 py-2 rounded hover:bg-orange-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Submitting..." : "Submit Result"}
    </button>
  );
}


// ==========================================================================
// RESULTS FORM
// ==========================================================================

export default function ResultsForm({ users, rodeos, events }: ResultsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedRodeoId, setSelectedRodeoId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [entries, setEntries] = useState<CompetitorEntry[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  // When the event changes, fetch the full registration records from the
  // gateway so we can resolve userId, entryId, and competitorName together.
  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRegistrationsLoading(true);

    fetchEventRegistrations(selectedEventId)
      .then((data) => { if (!cancelled) setEntries(data); })
      .catch(() => { if (!cancelled) setEntries([]); })
      .finally(() => { if (!cancelled) setRegistrationsLoading(false); });

    return () => { cancelled = true; };
  }, [selectedEventId]);

  const [state, formAction] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await addRodeoResult(formData);
      if ("error" in result) {
        return { error: result.error ?? "Unknown error", success: false };
      }
      formRef.current?.reset();
      setSelectedRodeoId("");
      setSelectedEventId("");
      setEntries([]);
      return { error: null, success: true };
    },
    initialState,
  );

  const filteredEvents = selectedRodeoId
    ? events.filter((e) => e.rodeoId === selectedRodeoId)
    : [];

  // Only show users who have a registration entry for the selected event.
  const entryUserIds = new Set(entries.map((e) => e.userId));
  const filteredUsers = selectedEventId
    ? users.filter((u) => entryUserIds.has(u.id))
    : [];

  const sortedRodeos = [...rodeos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Submit New Result</h2>

      {state.success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 mb-4">
          <p className="text-sm font-medium text-green-800">
            Result submitted successfully. The public results pages will reflect
            the update on their next visit.
          </p>
        </div>
      )}

      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mb-4">
          <p className="text-sm font-medium text-red-800">{state.error}</p>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        {/* --- 1. Rodeo Dropdown --- */}
        <div>
          <label htmlFor="rodeoId" className="block text-sm font-medium mb-1 text-gray-700">
            Rodeo
          </label>
          <select
            id="rodeoId"
            required
            value={selectedRodeoId}
            onChange={(e) => {
              setSelectedRodeoId(e.target.value);
              setSelectedEventId("");
              setEntries([]);
            }}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            <option value="" disabled>Select a rodeo...</option>
            {sortedRodeos.map((r) => (
              <option key={r.id} value={r.id}>{r.rodeoTitle} — {r.location}</option>
            ))}
          </select>
          {rodeos.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">
              No rodeos found. Create a rodeo first under <strong>Events</strong>.
            </p>
          )}
        </div>

        {/* --- 2. Event Dropdown (filtered by selected rodeo) --- */}
        <div>
          <label htmlFor="eventId" className="block text-sm font-medium mb-1 text-gray-700">
            Event
          </label>
          <select
            id="eventId"
            name="eventId"
            required
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setEntries([]);
            }}
            disabled={!selectedRodeoId || filteredEvents.length === 0}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {selectedRodeoId
                ? filteredEvents.length === 0
                  ? "No events for this rodeo"
                  : "Select an event..."
                : "Select a rodeo first"}
            </option>
            {filteredEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.category} — {evt.eventDate}
                {evt.eventTime ? ` at ${evt.eventTime}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* --- 3. Competitor Dropdown (filtered by event registrations) --- */}
        <div>
          <label htmlFor="userId" className="block text-sm font-medium mb-1 text-gray-700">
            Competitor
          </label>
          <select
            id="userId"
            name="userId"
            required
            defaultValue=""
            onChange={(e) => {
              // Find the matching entry so we can attach hidden fields.
              const uid = e.target.value;
              const match = entries.find((en) => en.userId === uid);
              // Update hidden inputs via DOM since React controlled state
              // for hidden fields is tricky with server actions.
              const entryIdInput = document.querySelector<HTMLInputElement>(
                'input[name="entryId"]',
              );
              const nameInput = document.querySelector<HTMLInputElement>(
                'input[name="competitorName"]',
              );
              if (entryIdInput) entryIdInput.value = match?.entryId ?? "";
              if (nameInput) nameInput.value = match?.competitorName ?? "";
            }}
            disabled={!selectedEventId || registrationsLoading || filteredUsers.length === 0}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {!selectedEventId
                ? "Select an event first"
                : registrationsLoading
                  ? "Loading registrations..."
                  : filteredUsers.length === 0
                    ? "No registered competitors"
                    : "Select a competitor..."}
            </option>
            {filteredUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          {selectedEventId && !registrationsLoading && filteredUsers.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">
              No competitors registered for this event.
            </p>
          )}
        </div>

        {/* Hidden fields for entryId and competitorName — populated by the
            competitor dropdown's onChange handler so the server action can
            receive them. */}
        <input type="hidden" name="entryId" value="" />
        <input type="hidden" name="competitorName" value="" />

        {/* --- 4. Performance Metrics (disabled until competitor available) --- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="score" className="block text-sm font-medium mb-1 text-gray-700">
              Time or Score
            </label>
            <input
              type="number" step="0.01" id="score" name="score" required
              disabled={!selectedEventId || filteredUsers.length === 0}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="placing" className="block text-sm font-medium mb-1 text-gray-700">
              Placing
            </label>
            <input
              type="number" id="placing" name="placing" required
              disabled={!selectedEventId || filteredUsers.length === 0}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* --- 5. Payouts (disabled until competitor available) --- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="payoutMoney" className="block text-sm font-medium mb-1 text-gray-700">
              Payout Money ($)
            </label>
            <input
              type="number" step="0.01" id="payoutMoney" name="payoutMoney" required
              disabled={!selectedEventId || filteredUsers.length === 0}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="groundMoney" className="block text-sm font-medium mb-1 text-gray-700">
              Ground Money ($)
            </label>
            <input
              type="number" step="0.01" id="groundMoney" name="groundMoney" required
              disabled={!selectedEventId || filteredUsers.length === 0}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}