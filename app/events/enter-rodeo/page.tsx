/**
 * Enter Rodeo page
 * -----------------
 * Lets a competitor:
 *   1. View their name + email.
 *   2. Add one or more event entries via the "Add Entry" pop-up
 *      (components/rodeo/AddEntryModal.tsx).
 *   3. Review everything they've added in a table before submitting.
 *   4. Submit — once that's confirmed saved, the page swaps in a
 *      confirmation view (same page, same URL) showing the confirmation
 *      number and the entries table, with buttons to start a new entry or
 *      go pay fees.
 *
 * Available rodeos are loaded from the gateway when the page opens and
 * filtered to only those currently accepting entries. Entries themselves
 * live in local component state until the competitor submits, at which
 * point each selected event is registered through the backend API.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/components/ui/Table";
import AddEntryModal from "@/components/rodeo/AddEntryModal";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";
import { RodeoEntry, RodeoEventData } from "@/types/rodeoEntry";
import { formatShortDate } from "@/lib/rodeoDateUtils";
import { useSession } from "@/lib/auth-client";
import { toIsoDate } from "@/lib/rodeoDateUtils";
import {
  getRodeos,
  getRodeo,
  registerForEvent,
  GatewayError,
} from "@/lib/gateway";

export default function EnterRodeoPage() {
  const { data: session, isPending } = useSession();
  const isSignedIn = Boolean(session?.user);
  const userId = session?.user.id ?? "";
  const competitorName = session?.user.name ?? "";
  const email = session?.user.email ?? "";

  // Flattened rodeo/event data formatted for the AddEntryModal.
  const [rodeoData, setRodeoData] = useState<RodeoEventData[]>([]);
  const [loadingRodeos, setLoadingRodeos] = useState(true);
  const [rodeoError, setRodeoError] = useState<string | null>(null);

  // Entries the competitor has added so far via the Add Entry pop-up.
  const [entries, setEntries] = useState<RodeoEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Submission state. `confirmationNumber` doubles as the "has this been
  // successfully submitted" flag — once it's set, the page shows the
  // confirmation view instead of the entry form.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [needsMembership, setNeedsMembership] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(
    null,
  );

  // Load rodeos currently accepting entries and reshape them into the
  // simplified format used by the Add Entry modal.
  useEffect(() => {
    async function loadRodeos() {
      try {
        setLoadingRodeos(true);

        // Get all rodeo summaries first. These provide the IDs needed to request
        // full rodeo details, including dates and available events.
        const rodeos = await getRodeos();

        const today = toIsoDate(new Date());

        // Only rodeos whose entry window is currently open should be available
        // for competitors to register.
        const openRodeos = rodeos.filter((rodeo) => {
          if (!rodeo.entriesOpen || !rodeo.entriesClose) {
            return false;
          }

          return rodeo.entriesOpen <= today && today <= rodeo.entriesClose;
        });

        // Load full details for each rodeo. The detailed response contains the
        // event list, schedules, and fees required for competitor registration.
        const rodeoDetails = await Promise.all(
          openRodeos.map((rodeo) => getRodeo(rodeo.id)),
        );

        // Keep only the fields the Add Entry modal needs and normalize each
        // rodeo into a lightweight UI model.
        const data: RodeoEventData[] = rodeoDetails.map((rodeo) => {
          const dates = rodeo.dates.map((date) => date.date).toSorted();

          return {
            rodeoId: rodeo.id,
            rodeoTitle: rodeo.rodeoTitle,
            rodeoDates: dates,
            entryFee: rodeo.entryFee,

            events: rodeo.events.map((event) => ({
              eventId: event.id,
              eventTitle: event.category,
              eventDate: event.eventDate,
              eventFee: event.eventFee,
            })),
          };
        });

        setRodeoData(data);
      } catch (err) {
        if (err instanceof GatewayError) {
          setRodeoError(err.message);
        } else {
          setRodeoError("Unable to load rodeos.");
        }
      } finally {
        setLoadingRodeos(false);
      }
    }

    loadRodeos();
  }, []);

  // Called by the Add Entry modal after a successful submission.
  // Adds the new entry to the review table and closes the modal.
  function handleAddEntry(entry: RodeoEntry) {
    setEntries((prev) => [...prev, entry]);
    setIsModalOpen(false);
  }

  // Removes an entry from the review table before submission.
  function handleRemoveEntry(id: string) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  // Table column headers, in the exact order the row objects below must
  // list their values — Table renders cells positionally, not by key name.
  const columns = ["Rodeo", "Date", "Event", "Entry Fee", "Event Fee", ""];

  // Convert each entry into the shape expected by the reusable Table
  // component, including the optional Remove button.
  const tableRows = entries.map((entry) => ({
    rodeo: entry.rodeoName,
    date: formatShortDate(entry.eventDate),
    event: entry.eventName,
    entryFee: `$${entry.entryFee.toFixed(2)}`,
    eventFee: `$${entry.eventFee.toFixed(2)}`,
    // The "Remove" column only makes sense before submission — after
    // confirmation the table is just a read-only summary, so we swap this
    // cell for a blank one rather than showing a button that does nothing.
    remove: confirmationNumber ? (
      ""
    ) : (
      <button
        type="button"
        onClick={() => handleRemoveEntry(entry.id)}
        className="text-sm font-medium text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    ),
  }));

  // Running total across all added entries — handy for the competitor to
  // see what they owe before (and after) submitting.
  const totalFees = entries.reduce(
    (sum, entry) => sum + entry.entryFee + entry.eventFee,
    0,
  );

  // Registers every selected event with the backend. All registrations are
  // submitted together so the competitor receives a single confirmation.
  async function handleSubmitEntries() {
    setIsSubmitting(true);
    setSubmitError(null);
    setNeedsMembership(false);

    try {
      if (!session) {
        throw new Error("You must be logged in to register.");
      }

      await Promise.all(
        entries.map((entry) =>
          registerForEvent(entry.eventId, {
            userId: userId,
            competitorName: competitorName,
          }),
        ),
      );

      // Placeholder until the backend returns a real confirmation number.
      setConfirmationNumber("success");
    } catch (err) {
      // The backend requires an active membership before allowing event
      // registration. Display a direct path to purchase one if needed.
      const code = (err as { code?: string })?.code;
      if (code === "MEMBERSHIP_REQUIRED") {
        setNeedsMembership(true);
      } else {
        setSubmitError(
          "Something went wrong submitting your entry. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Resets the whole page back to a blank slate so the competitor can
  // submit a separate entry (e.g. for another rodeo).
  function handleStartNewEntry() {
    setEntries([]);
    setConfirmationNumber(null);
    setSubmitError(null);
  }

  return (
    <main className={pageStructure.pageWrapper}>
      <Hero
        badge="COMPETITOR REGISTRATION"
        title="Enter a Rodeo"
        description="Register for upcoming CCRA rodeo events and secure your spot in the arena. Select your event, submit your entry, and get ready to compete."
      />

      <div className={pageStructure.contentContainer}>
        {isPending ? (
          // While authentication status is loading, show an empty placeholder
          // to prevent layout shifting.
          <div className="h-10 w-10" aria-hidden="true" />
        ) : !isSignedIn ? (
          // User is not signed in. Show login prompt and hide the entry form.
          <section className="mt-8 rounded-md border border-stone-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">
              Please sign in to enter a rodeo
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              You must have an account to submit rodeo entries.
            </p>

            <Link
              href="/sign-in"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Sign In
            </Link>
          </section>
        ) : (
          // User is signed in. Show the entry form and registration content.
          <>
            {confirmationNumber ? (
              // --- Confirmation view -------------------------------------------
              // Shown in place of the form once the entry has been successfully
              // saved. Same page/URL — just swapping what's rendered.
              <section className="mb-8 rounded-md border border-green-800 bg-green-50 p-6">
                <h2 className="mb-1 text-xl font-semibold text-green-800">
                  Entry submitted successfully!
                </h2>
                <p className="text-sm text-green-800">
                  Confirmation #:{" "}
                  <span className="font-mono font-semibold">
                    {confirmationNumber}
                  </span>
                </p>
                <p className="mt-1 text-sm text-green-800">
                  A confirmation email is on its way to {email}.
                </p>
              </section>
            ) : (
              // --- Competitor info -----------------------------------------------
              <section className="mb-8 rounded-md border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-stone-950">
                  Your Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Competitor Name */}
                  <div>
                    <label
                      htmlFor="competitorName"
                      className="block text-sm font-medium text-stone-600"
                    >
                      Competitor Name
                    </label>
                    <input
                      id="Competitor Name"
                      type="text"
                      value={competitorName}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-stone-200 bg-stone-100 px-3 py-2 text-sm"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-stone-600"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-stone-200 bg-stone-100 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* --- Add Entry button + pop-up -------------------------------------
          Hidden once submitted — entries are locked in at that point. */}
            {!confirmationNumber && (
              <>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                  >
                    + Add Entry
                  </button>
                </div>

                <AddEntryModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onAddEntry={handleAddEntry}
                  rodeos={rodeoData}
                />
              </>
            )}

            {/* --- Entries table ---------------------------------------------------
          Left in place after submission too, as a summary of what was entered. */}
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-stone-950">
                {confirmationNumber ? "Entries Submitted" : "Your Entries"}
              </h2>
              {entries.length === 0 ? (
                <p className="text-sm text-stone-600">
                  No entries yet — use "Add Entry" above to add your first
                  event.
                </p>
              ) : (
                <>
                  <Table columns={columns} data={tableRows} />
                  <p className="mt-3 text-sm font-medium text-stone-600">
                    Total fees: ${totalFees.toFixed(2)}
                  </p>
                </>
              )}

              {needsMembership && (
                <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                  <p className="font-medium">
                    An active CCRA membership is required to enter events.
                  </p>
                  <a
                    href="/membership"
                    className="mt-2 inline-flex rounded-md bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700"
                  >
                    Get a membership
                  </a>
                </div>
              )}
            </section>

            {confirmationNumber ? (
              // --- Post-submission actions --------------------------------------
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleStartNewEntry}
                  className="rounded-md border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-200"
                >
                  New Entry
                </button>
                <Link
                  href="/events/pay-fees"
                  className="rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Pay Fees
                </Link>
              </div>
            ) : (
              // --- Submit ---------------------------------------------------------
              <div>
                <button
                  type="button"
                  onClick={handleSubmitEntries}
                  disabled={entries.length === 0 || isSubmitting}
                  className="rounded-md bg-stone-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? "Submitting…" : "Submit Entry"}
                </button>
                {submitError && (
                  <p className="mt-2 text-sm text-red-700">{submitError}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
