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
 * Entries live in local component state (`entries`) — `submitRodeoEntries`
 * in lib/sampleRodeoData.ts stands in for the real save-to-database call
 * for now. Swap that function's body out for a real API call once the
 * backend exists; this page doesn't need to change since it already
 * treats submission as an async call that can fail.
 */

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Table from "@/components/ui/Table";
import AddEntryModal from "@/components/rodeo/AddEntryModal";
import Hero from "@/components/ui/Hero";
import { RodeoEntry } from "@/types/rodeo";
import { formatShortDate } from "@/lib/rodeoDateUtils";
import { submitRodeoEntries } from "@/lib/sampleRodeoData";
import { useSession } from "@/lib/auth-client";

// Fields collected by the top-level competitor form.
interface CompetitorFormValues {
  competitorName: string;
  email: string;
  confirmEmail: string;
}

// A basic, permissive email pattern — good enough for client-side sanity
// checking; real validation should still happen server-side.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyCompetitorValues: CompetitorFormValues = {
  competitorName: "",
  email: "",
  confirmEmail: "",
};

export default function EnterRodeoPage() {
  const { data: session, isPending } = useSession();
  const isSignedIn = Boolean(session?.user);
  const competitorName = session?.user.name ?? "";
  const email = session?.user.email ?? "";
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CompetitorFormValues>({ defaultValues: emptyCompetitorValues });

  // Watched so the "confirm email" validator can compare live against it.
  //const email = watch("email");

  // Entries the competitor has added so far via the Add Entry pop-up.
  const [entries, setEntries] = useState<RodeoEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Submission state. `confirmationNumber` doubles as the "has this been
  // successfully submitted" flag — once it's set, the page shows the
  // confirmation view instead of the entry form.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(
    null,
  );

  function handleAddEntry(entry: RodeoEntry) {
    setEntries((prev) => [...prev, entry]);
    setIsModalOpen(false);
  }

  function handleRemoveEntry(id: string) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  // Table column headers, in the exact order the row objects below must
  // list their values — Table renders cells positionally, not by key name.
  const columns = [
    "Rodeo",
    "Date",
    "Event",
    "Partner",
    "Entry Fee",
    "Event Fee",
    "",
  ];

  const tableRows = entries.map((entry) => ({
    rodeo: entry.rodeoName,
    date: `${formatShortDate(entry.performanceDate)} @ ${entry.performanceTime}`,
    event: entry.eventName,
    partner: entry.partner ?? "—",
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

  // Wrapping in react-hook-form's `handleSubmit` means clicking "Submit
  // Entry" first validates competitorName/email/confirmEmail against the
  // rules on their `register(...)` calls below (required, email pattern,
  // and the emails-match check). If any of those fail, RHF populates
  // `errors` (so the existing red messages under each field show up) and
  // `onSubmit` below never runs — the entries never get sent.
  const handleSubmitEntries = handleSubmit(async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitRodeoEntries({
        competitorName: values.competitorName,
        email: values.email,
        entries,
      });
      setConfirmationNumber(result.confirmationNumber);
    } catch (err) {
      setSubmitError(
        "Something went wrong submitting your entry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  // Resets the whole page back to a blank slate so the competitor can
  // submit a separate entry (e.g. for another rodeo).
  function handleStartNewEntry() {
    reset(emptyCompetitorValues);
    setEntries([]);
    setConfirmationNumber(null);
    setSubmitError(null);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Hero
        badge="COMPETITOR REGISTRATION"
        title="Enter a Rodeo"
        description="Register for upcoming CCRA rodeo events and secure your spot in the arena. Select your event, submit your entry, and get ready to compete."
      />

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
                A confirmation email is on its way to {watch("email")}.
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
              <p className="text-sm text-stone-400">
                No entries yet — use "Add Entry" above to add your first event.
              </p>
            ) : (
              <>
                <Table columns={columns} data={tableRows} />
                <p className="mt-3 text-sm font-medium text-stone-600">
                  Total fees: ${totalFees.toFixed(2)}
                </p>
              </>
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
    </main>
  );
}
