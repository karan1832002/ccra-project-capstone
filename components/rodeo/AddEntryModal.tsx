/**
 * AddEntryModal
 * -------------
 * Pop-up form used on the Enter Rodeo page to add a single event entry.
 *
 * Flow:
 *   1. User picks a Rodeo — since a rodeo can run across several days, each
 *      option in this dropdown is actually one specific performance (a
 *      rodeo + a single day/time), e.g. "Pincher Creek - Aug 03 @ 11 am".
 *      Only rodeos currently open for entries are listed here at all.
 *   2. The Event dropdown loads, filtered to only the competition events
 *      offered at that rodeo.
 *   3. Entry Fee / Event Fee auto-fill from the selected event and are
 *      read-only — the entrant doesn't set these themselves.
 *   4. "Add Entry" validates the form and hands a fully-formed
 *      `RodeoEntry` back to the parent page via `onAddEntry`. The parent
 *      is responsible for appending it to the entries table.
 *   "Cancel" (or closing without submitting) discards whatever was
 *   typed — the parent's entries list is only touched on submit.
 *
 * This component owns its own react-hook-form instance, so each time
 * it's opened fresh it starts from a blank slate.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Member, RodeoEntry } from "@/types/rodeo";
import { getActiveMembers } from "@/lib/sampleMemberData";
import { formatRodeoPerformanceLabel } from "@/lib/rodeoDateUtils";

interface RodeoEventData {
  rodeoId: string;
  rodeoTitle: string;
  rodeoDate: string;
  rodeoStartTime: string | null;
  entryFee: number | null;
  events: {
    eventId: string;
    eventTitle: string;
    eventFee: number | null;
  }[];
}

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void; // called for both Cancel and the backdrop click
  onAddEntry: (entry: RodeoEntry) => void; // called only when the user submits
  rodeos: RodeoEventData[];
}

// One selectable option in the "Rodeo" dropdown — a single rodeo performance
// (one specific day/time within a possibly multi-day rodeo). Flattened out
// of `RodeoEvent.performances` so the dropdown can show — and the entrant
// can pick — the rodeo and the exact date/time in one selection.
interface RodeoPerformanceOption {
  key: string; // `${rodeoId}::${performanceId}` — used as the <select> value since it must be a single string
  rodeoId: string;
  rodeoName: string;
  performanceId: string;
  performanceDate: string;
  performanceTime: string;
  label: string;
}

// Shape of the fields react-hook-form manages. Fees are stored as numbers
// but rendered read-only, since they're derived from the chosen event
// rather than typed in by the entrant.
interface AddEntryFormValues {
  performanceKey: string; // identifies both the rodeo and the specific day/time picked
  eventId: string;
  entryFee: number | "";
  eventFee: number | "";
}

const emptyValues: AddEntryFormValues = {
  performanceKey: "",
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
  // --- Reference data loaded from the (sample) data layer ---------------
  const [events, setEvents] = useState<RodeoEventData["events"]>([]); // events available for the *currently selected* rodeo
  const [members, setMembers] = useState<Member[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEntryFormValues>({ defaultValues: emptyValues });

  const selectedPerformanceKey = watch("performanceKey");
  const selectedEventId = watch("eventId");

  // Map each open rodeo's performances into individual dropdown options,
  // e.g. one "Pincher Creek" rodeo with two performances becomes two options.
  const performanceOptions = useMemo<RodeoPerformanceOption[]>(
    () =>
      rodeos.map((rodeo) => ({
        key: rodeo.rodeoId,
        rodeoId: rodeo.rodeoId,
        rodeoName: rodeo.rodeoTitle,
        performanceId: rodeo.rodeoId,
        performanceDate: rodeo.rodeoDate,
        performanceTime: rodeo.rodeoStartTime ?? "",
        label: `${rodeo.rodeoTitle} - ${fmtMonthDay(rodeo.rodeoDate)} @ ${
          rodeo.rodeoStartTime ?? "TBD"
        }`,
      })),
    [rodeos],
  );

  const selectedPerformance = performanceOptions.find(
    (p) => p.key === selectedPerformanceKey,
  );

  // The full CompetitionEvent object for whatever is currently selected —
  // its eventFee is used to autofill the Event Fee field.
  const selectedEvent = events.find((e) => e.eventId === selectedEventId);

  // The rodeo backing the selected performance — its entryFee (not the
  // event's) is used to autofill the Entry Fee field.
  const selectedRodeo = rodeos.find(
    (r) => r.rodeoId === selectedPerformance?.rodeoId,
  );

  // Load the list of active members once, when the modal first mounts.
  useEffect(() => {
    getActiveMembers().then(setMembers);
  }, []);

  // Reset the form back to blank every time the modal is (re)opened, so
  // stale selections from a previous entry don't leak into the next one.
  useEffect(() => {
    if (isOpen) {
      reset(emptyValues);
      setEvents([]);
    }
  }, [isOpen, reset]);

  // When the selected rodeo changes (i.e. a performance from a *different*
  // rodeo was picked), load the events offered there and clear out anything
  // downstream (event, fees) that no longer applies. Picking a
  // different performance of the *same* rodeo doesn't need to re-fetch.
  const selectedRodeoId = selectedPerformance?.rodeoId;
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

  // When the event changes, autofill the fee fields.
  useEffect(() => {
    setValue("entryFee", selectedRodeo?.entryFee ?? "");
    setValue("eventFee", selectedEvent?.eventFee ?? "");
  }, [selectedRodeo, selectedEvent, setValue]);

  if (!isOpen) return null;

  const onSubmit = (values: AddEntryFormValues) => {
    const performance = performanceOptions.find(
      (p) => p.key === values.performanceKey,
    );
    const event = events.find((e) => e.eventId === values.eventId);
    if (!performance || !event) return; // shouldn't happen — inputs are validated below

    const rodeo = rodeos.find((r) => r.rodeoId === performance.rodeoId);

    const entry: RodeoEntry = {
      id: crypto.randomUUID(),

      rodeoId: performance.rodeoId,
      rodeoName: performance.rodeoName,

      performanceId: performance.performanceId,
      performanceDate: performance.performanceDate,
      performanceTime: performance.performanceTime,

      eventId: event.eventId,
      eventName: event.eventTitle,

      entryFee: rodeo?.entryFee ?? 0,
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
            {/* Rodeo dropdown — each option is one specific performance (rodeo + date/time),
                and only rodeos currently open for entries are listed. */}
            <div>
              <label
                htmlFor="performanceKey"
                className="block text-sm font-medium text-stone-700"
              >
                Rodeo
              </label>
              <select
                id="performanceKey"
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                {...register("performanceKey", {
                  required: "Please select a rodeo",
                })}
              >
                {performanceOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.performanceKey && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.performanceKey.message}
                </p>
              )}
            </div>

            {/* Event dropdown — disabled until a rodeo is picked */}
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
                disabled={!selectedPerformance}
                {...register("eventId", { required: "Please select an event" })}
              >
                <option value="">
                  {selectedPerformance
                    ? "Select an event"
                    : "Select a rodeo first"}
                </option>
                {events.map((event) => (
                  <option key={event.eventId} value={event.eventId}>
                    {event.eventTitle}
                  </option>
                ))}
              </select>
              {errors.eventId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.eventId.message}
                </p>
              )}
            </div>

            {/* Entry Fee / Event Fee — autofilled from the selected event, read-only */}
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
