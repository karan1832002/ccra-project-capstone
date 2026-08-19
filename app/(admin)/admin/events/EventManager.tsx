"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { addEvent, removeEvent, fetchRodeoDetail } from "./actions";
import { CATEGORIES } from "./RodeoForm";
import type { Event as GatewayEvent } from "@/lib/gateway";
import ConfirmForm from "@/components/ui/ConfirmForm";

interface EventManagerProps {
  rodeoId: string;
}

// --- Event Manager ---
// Client component bound to a single parent rodeo. Displays the list of
// competition events (disciplines) currently assigned and provides a form
// to add new events via the addEvent server action. Each existing event
// can be removed through a ConfirmForm-gated delete button.
//
// Events are fetched on mount from the gateway via fetchRodeoDetail and
// held in local state. Adding or removing an event updates the list
// optimistically from the gateway response to avoid a full re-fetch.
export default function EventManager({ rodeoId }: EventManagerProps) {
  const [events, setEvents] = useState<GatewayEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Add-event form state.
  const [category, setCategory] = useState("Bull Riding");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventFee, setEventFee] = useState("");
  const [addPending, startAddTransition] = useTransition();
  const [addError, setAddError] = useState<string | null>(null);

  // Fetches the rodeo detail and extracts the nested events array.
  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    setLoadError(null);
    try {
      const detail = await fetchRodeoDetail(rodeoId);
      setEvents(detail.events ?? []);
    } catch (err: unknown) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load events.",
      );
    } finally {
      setLoadingEvents(false);
    }
  }, [rodeoId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents();
  }, [loadEvents]);

  // Builds an EventPayload from controlled inputs and calls the addEvent
  // server action. On success the returned event is appended to local
  // state and the form resets.
  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);

    startAddTransition(async () => {
      try {
        const created = await addEvent(rodeoId, {
          category,
          eventDate,
          eventTime,
          eventFee: parseFloat(eventFee) || 0,
        });
        setEvents((prev) => [...prev, created]);
        setEventDate("");
        setEventTime("");
        setEventFee("");
      } catch (err: unknown) {
        setAddError(
          err instanceof Error ? err.message : "Failed to add event.",
        );
      }
    });
  }

  // Deletes an event then removes it from local state.
  async function handleRemoveEvent(eventId: string) {
    try {
      await removeEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch {
      // The server action already revalidates; if it fails the gateway
      // will surface the error via its own mechanism.
    }
  }

  return (
    <div className="rounded-md border border-border bg-surface p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-heading-text">
        Manage Competition Events
      </h3>

      {/* --- Add Event Form --- */}
      <form onSubmit={handleAddEvent} className="space-y-4">
        <h4 className="text-sm font-medium text-body-text">
          Add a New Discipline
        </h4>

        {addError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {addError}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Category select */}
          <div>
            <label
              htmlFor="event-category"
              className="block text-xs font-medium uppercase tracking-wider text-caption-text mb-1"
            >
              Category
            </label>
            <select
              id="event-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Event Date */}
          <div>
            <label
              htmlFor="event-date"
              className="block text-xs font-medium uppercase tracking-wider text-caption-text mb-1"
            >
              Date
            </label>
            <input
              id="event-date"
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          {/* Event Time */}
          <div>
            <label
              htmlFor="event-time"
              className="block text-xs font-medium uppercase tracking-wider text-caption-text mb-1"
            >
              Time
            </label>
            <input
              id="event-time"
              type="time"
              required
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          {/* Event Fee */}
          <div>
            <label
              htmlFor="event-fee"
              className="block text-xs font-medium uppercase tracking-wider text-caption-text mb-1"
            >
              Event Fee ($)
            </label>
            <input
              id="event-fee"
              type="number"
              step="0.01"
              min="0"
              required
              value={eventFee}
              onChange={(e) => setEventFee(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="50.00"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={addPending}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-text transition hover:bg-primary-dark disabled:opacity-50"
          >
            {addPending ? "Adding..." : "Add Event"}
          </button>
        </div>
      </form>

      {/* --- Existing Events List --- */}
      <div>
        <h4 className="text-sm font-medium text-body-text mb-3">
          Assigned Disciplines
        </h4>

        {loadingEvents ? (
          <p className="text-sm text-body-text">Loading events...</p>
        ) : loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {loadError}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-body-text">
            No disciplines assigned yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-highlight">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                    Time
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                    Fee
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr
                    key={evt.id}
                    className="border-b border-border hover:bg-highlight"
                  >
                    <td className="px-4 py-2.5 text-sm font-medium text-heading-text">
                      {evt.category}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-body-text">
                      {evt.eventDate}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-body-text">
                      {evt.eventTime}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-body-text">
                      ${evt.eventFee.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5">
                      <ConfirmForm
                        action={() => void handleRemoveEvent(evt.id)}
                        message={`Remove "${evt.category}" event? This action cannot be undone.`}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/40"
                        >
                          Remove
                        </button>
                      </ConfirmForm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}