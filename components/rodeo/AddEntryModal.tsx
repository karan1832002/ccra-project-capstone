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
 *   3. If the selected event is a team event (Team Roping / Ribbon
 *      Roping), a Partner dropdown appears, listing active members.
 *   4. Entry Fee / Event Fee auto-fill from the selected event and are
 *      read-only — the entrant doesn't set these themselves.
 *   5. "Add Entry" validates the form and hands a fully-formed
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
import { CompetitionEvent, Member, RodeoEntry, RodeoEvent } from "@/types/rodeo";
import { getRodeosOpenForEntries, getCompetitionEventsForRodeo } from "@/lib/sampleRodeoData";
import { getActiveMembers } from "@/lib/sampleMemberData";
import { formatRodeoPerformanceLabel } from "@/lib/rodeoDateUtils";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void; // called for both Cancel and the backdrop click
  onAddEntry: (entry: RodeoEntry) => void; // called only when the user submits
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
  partner: string;
  entryFee: number | "";
  eventFee: number | "";
}

const emptyValues: AddEntryFormValues = {
  performanceKey: "",
  eventId: "",
  partner: "",
  entryFee: "",
  eventFee: "",
};

export default function AddEntryModal({ isOpen, onClose, onAddEntry }: AddEntryModalProps) {
  // --- Reference data loaded from the (sample) data layer ---------------
  const [rodeos, setRodeos] = useState<RodeoEvent[]>([]); // only rodeos currently open for entries
  const [events, setEvents] = useState<CompetitionEvent[]>([]); // events available for the *currently selected* rodeo
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingRodeos, setIsLoadingRodeos] = useState(true);

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

  // Flatten each open rodeo's performances into individual dropdown options,
  // e.g. one "Pincher Creek" rodeo with two performances becomes two options.
  const performanceOptions = useMemo<RodeoPerformanceOption[]>(
    () =>
      rodeos.flatMap((rodeo) =>
        rodeo.performances.map((performance) => ({
          key: `${rodeo.id}::${performance.id}`,
          rodeoId: rodeo.id,
          rodeoName: rodeo.name,
          performanceId: performance.id,
          performanceDate: performance.date,
          performanceTime: performance.time,
          label: formatRodeoPerformanceLabel(rodeo, performance),
        }))
      ),
    [rodeos]
  );

  const selectedPerformance = performanceOptions.find((p) => p.key === selectedPerformanceKey);

  // The full CompetitionEvent object for whatever is currently selected —
  // used both to know if it's a team event and to autofill the fees.
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Load the list of currently-open rodeos once, when the modal first mounts.
  useEffect(() => {
    getRodeosOpenForEntries().then((data) => {
      setRodeos(data);
      setIsLoadingRodeos(false);
    });
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
  // downstream (event, partner, fees) that no longer applies. Picking a
  // different performance of the *same* rodeo doesn't need to re-fetch.
  const selectedRodeoId = selectedPerformance?.rodeoId;
  useEffect(() => {
    if (!selectedRodeoId) {
      setEvents([]);
      return;
    }
    getCompetitionEventsForRodeo(selectedRodeoId).then(setEvents);
    setValue("eventId", "");
    setValue("partner", "");
    setValue("entryFee", "");
    setValue("eventFee", "");
  }, [selectedRodeoId, setValue]);

  // When the event changes, autofill the fee fields and clear any
  // previously-selected partner (in case the entrant switches from a
  // team event to a non-team event).
  useEffect(() => {
    if (!selectedEvent) {
      setValue("entryFee", "");
      setValue("eventFee", "");
      return;
    }
    setValue("entryFee", selectedEvent.entryFee);
    setValue("eventFee", selectedEvent.eventFee);
    setValue("partner", "");
  }, [selectedEvent, setValue]);

  if (!isOpen) return null;

  const onSubmit = (values: AddEntryFormValues) => {
    const performance = performanceOptions.find((p) => p.key === values.performanceKey);
    const event = events.find((e) => e.id === values.eventId);
    if (!performance || !event) return; // shouldn't happen — inputs are validated below

    const entry: RodeoEntry = {
      id: crypto.randomUUID(),
      rodeoId: performance.rodeoId,
      rodeoName: performance.rodeoName,
      performanceId: performance.performanceId,
      performanceDate: performance.performanceDate,
      performanceTime: performance.performanceTime,
      eventId: event.id,
      eventName: event.name,
      partner: event.isTeamEvent ? values.partner : undefined,
      entryFee: event.entryFee,
      eventFee: event.eventFee,
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
              <label htmlFor="performanceKey" className="block text-sm font-medium text-stone-700">
                Rodeo
              </label>
              <select
                id="performanceKey"
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                disabled={isLoadingRodeos}
                {...register("performanceKey", { required: "Please select a rodeo" })}
              >
                <option value="">
                  {isLoadingRodeos
                    ? "Loading rodeos…"
                    : performanceOptions.length === 0
                    ? "No rodeos are currently open for entries"
                    : "Select a rodeo"}
                </option>
                {performanceOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.performanceKey && (
                <p className="mt-1 text-sm text-red-600">{errors.performanceKey.message}</p>
              )}
            </div>

            {/* Event dropdown — disabled until a rodeo is picked */}
            <div>
              <label htmlFor="eventId" className="block text-sm font-medium text-stone-700">
                Event
              </label>
              <select
                id="eventId"
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-stone-100 disabled:text-stone-400"
                disabled={!selectedPerformance}
                {...register("eventId", { required: "Please select an event" })}
              >
                <option value="">
                  {selectedPerformance ? "Select an event" : "Select a rodeo first"}
                </option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              {errors.eventId && (
                <p className="mt-1 text-sm text-red-600">{errors.eventId.message}</p>
              )}
            </div>

            {/* Partner dropdown — only rendered for team events (Team Roping, Ribbon Roping, etc.) */}
            {selectedEvent?.isTeamEvent && (
              <div>
                <label htmlFor="partner" className="block text-sm font-medium text-stone-700">
                  Partner
                </label>
                <Controller
                  name="partner"
                  control={control}
                  rules={{ required: "Please select a partner for this team event" }}
                  render={({ field }) => (
                    <select
                      id="partner"
                      {...field}
                      className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="">Select a partner</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.partner && (
                  <p className="mt-1 text-sm text-red-600">{errors.partner.message}</p>
                )}
              </div>
            )}

            {/* Entry Fee / Event Fee — autofilled from the selected event, read-only */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="entryFee" className="block text-sm font-medium text-stone-700">
                  Entry Fee
                </label>
                <input
                  id="entryFee"
                  readOnly
                  value={
                    selectedEvent ? `$${selectedEvent.entryFee.toFixed(2)}` : ""
                  }
                  placeholder="—"
                  className="mt-1 block w-full cursor-not-allowed rounded-md border border-stone-300 bg-stone-100 px-3 py-2 text-sm text-stone-600"
                />
              </div>
              <div>
                <label htmlFor="eventFee" className="block text-sm font-medium text-stone-700">
                  Event Fee
                </label>
                <input
                  id="eventFee"
                  readOnly
                  value={
                    selectedEvent ? `$${selectedEvent.eventFee.toFixed(2)}` : ""
                  }
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