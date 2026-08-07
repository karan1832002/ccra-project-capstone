/**
 * AddEntryModal
 * -------------
 * Pop-up form used on the Enter Rodeo page to add a single rodeo event
 * to the competitor's registration.
 *
 * Flow:
 *   1. The competitor selects a rodeo that is currently accepting entries.
 *   2. The available competition events for that rodeo are loaded.
 *   3. Entry Fee and Event Fee are automatically filled in from the
 *      selected rodeo and event.
 *   4. Clicking "Add Entry" creates a RodeoEntry object and passes it
 *      back to the parent page, where it is added to the registration table.
 *
 * This component owns its own react-hook-form instance, so every time the
 * modal is opened it starts with a fresh, empty form.
 */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RodeoEntry, RodeoEventData } from "@/types/rodeoEntry";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void; // Closes the modal without adding an entry.
  onAddEntry: (entry: RodeoEntry) => void; // Adds the completed entry to the parent page.
  rodeos: RodeoEventData[];
}

// Form fields managed by react-hook-form. The fee fields are populated
// automatically based on the selected rodeo and event.
interface AddEntryFormValues {
  rodeoId: string;
  eventId: string;
  entryFee: number | "";
  eventFee: number | "";
}

const emptyValues: AddEntryFormValues = {
  rodeoId: "",
  eventId: "",
  entryFee: "",
  eventFee: "",
};

// Format dates as MMM DD (i.e. Aug 29)
function fmtMonthDay(dateStr: string | null): string {
  if (!dateStr) return "—";

  const [y, m, d] = dateStr.split("-").map(Number);

  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}

function fmtFee(fee: number | null): string {
  return fee != null ? `$${fee.toFixed(2)}` : "—";
}

export default function AddEntryModal({
  isOpen,
  onClose,
  onAddEntry,
  rodeos,
}: AddEntryModalProps) {
  // Events available for the currently selected rodeo.
  const [events, setEvents] = useState<RodeoEventData["events"]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEntryFormValues>({ defaultValues: emptyValues });

  const selectedEventId = watch("eventId");

  const selectedRodeoId = watch("rodeoId");

  // Currently selected event, used to populate the Event Fee field.
  const selectedEvent = events.find((e) => e.eventId === selectedEventId);

  // Currently selected rodeo, used to populate the Entry Fee field.
  const selectedRodeo = rodeos.find((r) => r.rodeoId === selectedRodeoId);

  // Reset the form each time the modal opens so every new entry starts
  // with a clean slate.
  useEffect(() => {
    if (isOpen) {
      reset(emptyValues);
      setEvents([]);
    }
  }, [isOpen, reset]);

  // When the selected rodeo changes, load its available events and clear
  // any previously selected event and fee values.
  useEffect(() => {
    if (!selectedRodeoId) {
      setEvents([]);
      return;
    }

    const rodeo = rodeos.find((r) => r.rodeoId === selectedRodeoId);

    setEvents(rodeo?.events ?? []);

    setValue("eventId", "");
    setValue("entryFee", "");
    setValue("eventFee", "");
  }, [selectedRodeoId, rodeos, setValue]);

  // Update the fee fields whenever the selected rodeo or event changes.
  useEffect(() => {
    setValue("entryFee", selectedRodeo?.entryFee ?? "");
    setValue("eventFee", selectedEvent?.eventFee ?? "");
  }, [selectedRodeo, selectedEvent, setValue]);

  if (!isOpen) return null;

  const onSubmit = (values: AddEntryFormValues) => {
    const rodeo = rodeos.find((r) => r.rodeoId === values.rodeoId);
    const event = events.find((e) => e.eventId === values.eventId);

    if (!rodeo || !event) return;

    const entry: RodeoEntry = {
      // crypto.randomUUID() only exists in a secure context (HTTPS or localhost).
      // The deployed site is served over plain HTTP, so fall back to a simple
      // unique id there. This is only a client-side list key, not a DB id.
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `entry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,

      rodeoId: rodeo.rodeoId,
      rodeoName: rodeo.rodeoTitle,

      eventId: event.eventId,
      eventName: event.eventTitle,
      eventDate: event.eventDate,

      entryFee: rodeo.entryFee ?? 0,
      eventFee: event.eventFee ?? 0,
    };

    onAddEntry(entry);
    reset(emptyValues);
  };

  return (
    // Backdrop — clicking outside the panel behaves the same as Cancel.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 px-4"
      onClick={onClose}
    >
      {/* Stop propagation so clicks inside the panel don't bubble to the backdrop */}
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-b border-stone-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-stone-800">Add Entry</h2>
          </div>

          <div className="space-y-4 px-6 py-5">
            {/* Rodeo dropdown. Displays rodeos currently accepting entries. */}
            <div>
              <label
                htmlFor="rodeoId"
                className="block text-sm font-medium text-stone-700"
              >
                Rodeo
              </label>
              <select
                id="rodeoId"
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-stone-100 disabled:text-stone-400"
                {...register("rodeoId", {
                  required: "Please select a rodeo",
                })}
              >
                <option value="">Select a rodeo</option>
                {rodeos.map((rodeo) => {
                  const startDate = fmtMonthDay(rodeo.rodeoDates[0]);
                  const endDate = fmtMonthDay(
                    rodeo.rodeoDates[rodeo.rodeoDates.length - 1],
                  );

                  const dateLabel =
                    startDate === endDate
                      ? startDate
                      : `${startDate} - ${endDate}`;

                  return (
                    <option key={rodeo.rodeoId} value={rodeo.rodeoId}>
                      {rodeo.rodeoTitle} ({dateLabel})
                    </option>
                  );
                })}
              </select>
              {errors.rodeoId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.rodeoId.message}
                </p>
              )}
            </div>

            {/* Event dropdown. Lists only the events offered by the selected rodeo.
            Disabled until a rodeo is picked */}
            <div>
              <label
                htmlFor="eventId"
                className="block text-sm font-medium text-stone-700"
              >
                Event
              </label>
              <select
                id="eventId"
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-stone-100 disabled:text-stone-400"
                disabled={!selectedRodeo}
                {...register("eventId", { required: "Please select an event" })}
              >
                <option value="">
                  {selectedRodeo ? "Select an event" : "Select a rodeo first"}
                </option>
                {events.map((event) => (
                  <option key={event.eventId} value={event.eventId}>
                    {event.eventTitle} - {fmtMonthDay(event.eventDate)}
                  </option>
                ))}
              </select>
              {errors.eventId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.eventId.message}
                </p>
              )}
            </div>

            {/* Entry Fee and Event Fee are populated automatically and cannot be edited. */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="entryFee"
                  className="block text-sm font-medium text-stone-700"
                >
                  Entry Fee
                </label>
                <input
                  id="entryFee"
                  readOnly
                  value={selectedRodeo ? fmtFee(selectedRodeo.entryFee) : ""}
                  placeholder="—"
                  className="mt-1 block w-full cursor-not-allowed rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm text-stone-600"
                />
              </div>
              <div>
                <label
                  htmlFor="eventFee"
                  className="block text-sm font-medium text-stone-700"
                >
                  Event Fee
                </label>
                <input
                  id="eventFee"
                  readOnly
                  value={selectedEvent ? fmtFee(selectedEvent.eventFee) : ""}
                  placeholder="—"
                  className="mt-1 block w-full cursor-not-allowed rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm text-stone-600"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 border-t border-stone-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
