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
import { Trash2, X } from "lucide-react";
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

  // Confirmation for entry removal from table
  const [entryPendingRemoval, setEntryPendingRemoval] =
    useState<RodeoEntry | null>(null);

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
        onClick={() => setEntryPendingRemoval(entry)}
        // onClick={() => handleRemoveEntry(entry.id)}
        className="text-sm font-medium text-danger hover:text-danger-dark"
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
    <>
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
            <section className="mt-8 rounded-md border border-border bg-surface p-6 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-heading-text">
                Please sign in to enter a rodeo
              </h2>
              <p className="mt-2 text-sm text-body-text">
                You must have an account to submit rodeo entries.
              </p>

              <Link
                href="/sign-in"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-text hover:bg-primary-dark"
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
                <section className="mb-8 rounded-md border border-border bg-surface p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-heading-text">
                    Your Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Competitor Name */}
                    <div>
                      <label
                        htmlFor="competitorName"
                        className="block text-sm font-medium text-body-text"
                      >
                        Competitor Name
                      </label>
                      <input
                        id="Competitor Name"
                        type="text"
                        value={competitorName}
                        readOnly
                        className="mt-1 block w-full rounded-md border border-border bg-disabled px-3 py-2 text-sm text-disabled-text"
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-body-text"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className="mt-1 block w-full rounded-md border border-border bg-disabled px-3 py-2 text-sm text-disabled-text"
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
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-text hover:bg-primary-dark"
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
                <h2 className="mb-4 text-xl font-semibold text-heading-text">
                  {confirmationNumber ? "Entries Submitted" : "Your Entries"}
                </h2>
                {entries.length === 0 ? (
                  <p className="text-sm text-body-text">
                    No entries yet — use "Add Entry" above to add your first
                    event.
                  </p>
                ) : (
                  <>
                    <Table columns={columns} data={tableRows} />
                    <p className="mt-3 text-sm font-medium text-body-text">
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
                    className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-body-text hover:bg-highlight"
                  >
                    New Entry
                  </button>
                  <Link
                    href="/events/pay-fees"
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-text hover:bg-primary-dark"
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
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-text hover:bg-primary-dark disabled:hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? "Submitting…" : "Submit Entry"}
                  </button>
                  {submitError && (
                    <p className="mt-2 text-sm text-danger">{submitError}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {entryPendingRemoval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-overlay-blur backdrop-blur-sm"
            onClick={() => setEntryPendingRemoval(null)}
          />

          <div className="relative w-full max-w-md rounded-md border border-border bg-surface p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setEntryPendingRemoval(null)}
              className="absolute right-4 top-4 rounded-md p-1 text-body-text transition hover:bg-highlight"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-danger flex items-center justify-center text-danger-text">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-heading-text">
                Remove entry?
              </h3>
            </div>

            <p className="text-sm text-body-text mb-6">
              Are you sure you want to remove {entryPendingRemoval.eventName}{" "}
              from your entries? This can't be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setEntryPendingRemoval(null)}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-heading-text transition hover:bg-highlight"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRemoveEntry(entryPendingRemoval.id);
                  setEntryPendingRemoval(null);
                }}
                className="inline-flex items-center justify-center rounded-md bg-danger px-4 py-2.5 text-sm font-semibold text-danger-text transition hover:bg-danger-dark"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
