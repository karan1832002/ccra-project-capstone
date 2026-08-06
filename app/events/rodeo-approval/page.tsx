"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";
import { submitRodeoApprovalAction } from "./actions";
import type { RodeoApprovalFormState } from "./actions";

const initialState: RodeoApprovalFormState = { success: false, message: "" };

const rodeoTypes = ["Full Rodeo", "Timed Events Only", "Roughstock Only"] as const;

const eventFields: Record<string, string[]> = {
  "Full Rodeo": [
    "Saddle Bronc",
    "Bareback",
    "Bull Riding",
    "Barrel Racing",
    "Tie Down Roping",
    "Steer Wrestling",
    "Team Roping",
    "Breakaway Roping",
    "Junior Events",
  ],
  "Timed Events Only": [
    "Barrel Racing",
    "Tie Down Roping",
    "Steer Wrestling",
    "Team Roping",
    "Breakaway Roping",
    "Junior Events",
  ],
  "Roughstock Only": ["Saddle Bronc", "Bareback", "Bull Riding"],
};

const cities = [
  "Calgary",
  "Edmonton",
  "Red Deer",
  "Lethbridge",
  "Medicine Hat",
  "Grande Prairie",
  "Fort McMurray",
  "Brooks",
  "Okotoks",
  "Airdrie",
  "Cochrane",
  "Strathmore",
  "Olds",
  "Innisfail",
  "Wetaskiwin",
  "Lloydminster",
  "Camrose",
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center justify-between border-t border-stone-200 pt-6">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Submitting..." : "Submit Approval Request"}
      </button>
    </div>
  );
}

function FeedbackBanner({ state }: { state: RodeoApprovalFormState }) {
  if (!state.message) return null;

  return (
    <div
      className={`rounded-md px-4 py-3 text-sm font-medium ${
        state.success
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      }`}
      role="alert"
    >
      {state.message}
    </div>
  );
}

export default function RodeoApprovalPage() {
  const [state, formAction] = useActionState(
    submitRodeoApprovalAction,
    initialState,
  );

  return (
    <main className={pageStructure.pageWrapper}>
      <Hero
        badge="HOST A RODEO"
        title="Committee Rodeo Approval Form"
        description="The Canadian Classic Rodeo Association (CCRA) welcomes communities interested in hosting high-quality rodeo events. Complete the form below to submit your rodeo for approval."
      />

      <div className={pageStructure.contentContainer}>
        {/* Need Assistance sidebar — outside the form, just informational */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT — pulled into the form below, placeholder collapsed here */}
            <div className="lg:col-span-2" />

            {/* RIGHT */}
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
              <p className="text-stone-700 leading-7">
                Questions about the approval process or CCRA regulations?
              </p>
              <div className="mt-6 space-y-2 text-stone-800">
                <p className="font-semibold">Gina Icenoggle</p>
                <p>(403) 555-0123</p>
                <p>office@canadianclassicrodeo.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM — wraps all inputs including the Hosting Format selector */}
        <form action={formAction} className="space-y-10">
          <FeedbackBanner state={state} />

          {/* Hosting Format — now inside the form so name="rodeoType" is submitted */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              Hosting Format
            </h2>
            <div className="space-y-3">
              {rodeoTypes.map((type) => (
                <label
                  key={type}
                  className="group flex w-[275px] items-center justify-between rounded-xl border px-6 py-5 transition-all duration-200 cursor-pointer bg-white border-stone-200 hover:border-orange-200"
                >
                  <input
                    type="radio"
                    name="rodeoType"
                    value={type}
                    defaultChecked={type === "Full Rodeo"}
                    className="sr-only peer"
                  />
                  <span className="font-semibold peer-checked:text-orange-600">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* 1. Basic Rodeo Info */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              1. Basic Rodeo Info
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="rodeoName"
                  className="text-sm font-medium text-stone-800"
                >
                  Rodeo Name *
                </label>
                <input
                  id="rodeoName"
                  name="rodeoName"
                  required
                  className="w-full h-[42px] border border-stone-300 rounded-md px-3 py-2 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="text-sm font-medium text-stone-800"
                >
                  Location *
                </label>
                <select
                  id="location"
                  name="location"
                  required
                  className="w-full h-[42px] border border-stone-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-800">
                Arena Type *
              </label>
              <div className="flex gap-6 mt-2 text-sm text-stone-800">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="arenaType"
                    value="Outdoor Arena"
                    required
                  />
                  Outdoor Arena
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="arenaType"
                    value="Indoor Arena"
                  />
                  Indoor Arena
                </label>
              </div>
            </div>
          </section>

          {/* 2. Added Money */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              2. Added Money (Optional)
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {eventFields["Full Rodeo"].map((event) => (
                <div key={event}>
                  <label className="text-sm font-medium text-stone-800">
                    {event}
                  </label>
                  <input
                    type="number"
                    name={`addedMoney_${event}`}
                    min={0}
                    step="0.01"
                    placeholder="$0.00"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 3. Performance & Personnel */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              3. Performance & Personnel
            </h2>

            <div>
              <label
                htmlFor="scheduleDetails"
                className="text-sm font-medium text-stone-800"
              >
                Schedule Details *
              </label>
              <textarea
                id="scheduleDetails"
                name="scheduleDetails"
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <label
                htmlFor="orderOfEvents"
                className="text-sm font-medium text-stone-800"
              >
                Order of Events
              </label>
              <textarea
                id="orderOfEvents"
                name="orderOfEvents"
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[80px]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="stockContractor"
                  className="text-sm font-medium text-stone-800"
                >
                  Stock Contractor *
                </label>
                <input
                  id="stockContractor"
                  name="stockContractor"
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="judges"
                  className="text-sm font-medium text-stone-800"
                >
                  Judges
                </label>
                <input
                  id="judges"
                  name="judges"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>
          </section>

          {/* 4. Facility Amenities */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              4. Facility Amenities
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-stone-800">
                  Electrical Plugins
                </label>
                <div className="flex flex-col gap-1 mt-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="electrical" value="Available" />
                    Available
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="electrical" value="None" />
                    None
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-800">
                  Stalls
                </label>
                <div className="flex flex-col gap-1 mt-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="stalls" value="Yes" />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="stalls" value="No" />
                    No
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-800">
                  Self-Penning
                </label>
                <div className="flex flex-col gap-1 mt-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="selfPenning" value="Permitted" />
                    Permitted
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selfPenning"
                      value="Not Allowed"
                    />
                    Not Allowed
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="stallContact"
                className="text-sm font-medium text-stone-800"
              >
                Stall/Camping Booking Contact Info
              </label>
              <input
                id="stallContact"
                name="stallContact"
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
          </section>

          {/* 5. Committee & Legal Info */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              5. Committee & Legal Info
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="committeeName"
                  className="text-sm font-medium text-stone-800"
                >
                  Official Committee Name *
                </label>
                <input
                  id="committeeName"
                  name="committeeName"
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="primaryContact"
                  className="text-sm font-medium text-stone-800"
                >
                  Primary Contact Person *
                </label>
                <input
                  id="primaryContact"
                  name="primaryContact"
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="mailingAddress"
                className="text-sm font-medium text-stone-800"
              >
                Mailing Address
              </label>
              <input
                id="mailingAddress"
                name="mailingAddress"
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-stone-800"
              >
                Contact Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-stone-800"
              >
                Contact Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="directions"
                className="text-sm font-medium text-stone-800"
              >
                Directions to Grounds (for map/GPS)
              </label>
              <textarea
                id="directions"
                name="directions"
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[80px]"
              />
            </div>
          </section>

          {/* 6. Medical & Fees */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              6. Medical & Fees
            </h2>
            <div>
              <label
                htmlFor="medicalProvider"
                className="text-sm font-medium text-stone-800"
              >
                On-site Medical Provider *
              </label>
              <input
                id="medicalProvider"
                name="medicalProvider"
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="associationFees"
                className="text-sm font-medium text-stone-800"
              >
                Association Fees
              </label>
              <textarea
                id="associationFees"
                name="associationFees"
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[60px]"
              />
            </div>
          </section>

          {/* 7. Agreement & Payment */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              7. Agreement & Payment
            </h2>
            <p className="text-sm text-stone-700">
              "I, the undersigned, represent the aforementioned Committee and
              agree to abide by all Canadian Classic Rodeo Association rules and
              regulations. We understand that this application is subject to CCRA
              board approval."
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="signature"
                  className="text-sm font-medium text-stone-800"
                >
                  Electronic Signature *
                </label>
                <input
                  id="signature"
                  name="signature"
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="dateSigned"
                  className="text-sm font-medium text-stone-800"
                >
                  Date Signed *
                </label>
                <input
                  id="dateSigned"
                  name="dateSigned"
                  required
                  type="date"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm font-medium text-stone-800">
                Payment Method for Sanctioning Fee *
              </label>
              <div className="grid sm:grid-cols-3 gap-3 mt-2">
                {["E-Transfer", "Cheque", "Credit Card"].map((method) => (
                  <label
                    key={method}
                    className="border border-stone-300 rounded-md px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-stone-100 has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium text-stone-800">
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}