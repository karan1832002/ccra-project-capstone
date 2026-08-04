"use client";

import { useState } from "react";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";

interface RodeoApprovalForm {
  rodeoType: string;
  payment: string;
  [key: string]: string | undefined;
}

export default function RodeoApprovalForm() {
  const [form, setForm] = useState<RodeoApprovalForm>({
    rodeoType: "Full Rodeo",
    payment: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev: RodeoApprovalForm) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!form.payment) newErrors.payment = "Please select a payment method.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      alert("Approval request submitted successfully!");
    }, 1000);
  };

  return (
    <main className={pageStructure.pageWrapper}>
      {/* Header */}
      <Hero
        badge="HOST A RODEO"
        title="Committee Rodeo Approval Form"
        description="The Canadian Classic Rodeo Association (CCRA) welcomes communities interested in hosting high-quality rodeo events. Complete the form below to submit your rodeo for approval."
      />

      <div className={pageStructure.contentContainer}>
        {/* Top Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-stone-700">
                Hosting Format
              </h2>

              <div className="space-y-3">
                {["Full Rodeo", "Timed Events Only", "Roughstock Only"].map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("rodeoType", type)}
                      className={`group flex w-[275px] items-center justify-between rounded-xl border px-6 py-5 transition-all duration-200
              ${
                form.rodeoType === type
                  ? "bg-orange-400 border-orange-400 text-white"
                  : "bg-white border-stone-200 hover:border-orange-20"
              }
            `}
                    >
                      <span className="font-semibold text-">{type}</span>
                    </button>
                  ),
                )}
              </div>
            </div>

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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. Basic Rodeo Info */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              1. Basic Rodeo Info
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-stone-800">
                  Rodeo Name *
                </label>
                <input
                  required
                  className="w-full h-[42px] border border-stone-300 rounded-md px-3 py-2 bg-white"
                  onChange={(e) => update("rodeoName", e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-800">
                  Location *
                </label>

                <select
                  required
                  className="w-full h-[42px] border border-stone-300 rounded-md px-3 py-2 bg-white"
                  onChange={(e) => update("city", e.target.value)}
                >
                  <option value="">Select City</option>
                  <option>Calgary</option>
                  <option>Edmonton</option>
                  <option>Red Deer</option>
                  <option>Lethbridge</option>
                  <option>Medicine Hat</option>
                  <option>Grande Prairie</option>
                  <option>Fort McMurray</option>
                  <option>Brooks</option>
                  <option>Okotoks</option>
                  <option>Airdrie</option>
                  <option>Cochrane</option>
                  <option>Strathmore</option>
                  <option>Olds</option>
                  <option>Innisfail</option>
                  <option>Wetaskiwin</option>
                  <option>Lloydminster</option>
                  <option>Camrose</option>
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
                    onChange={(e) => update("arenaType", e.target.value)}
                  />
                  Outdoor Arena
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="arenaType"
                    value="Indoor Arena"
                    onChange={(e) => update("arenaType", e.target.value)}
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
              {eventFields[form.rodeoType].map((event) => (
                <div key={event}>
                  <label className="text-sm font-medium text-stone-800">
                    {event}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="$0.00"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                    value={form[event] || ""}
                    onChange={(e) => update(event, e.target.value)}
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
              <label className="text-sm font-medium text-stone-800">
                Schedule Details *
              </label>
              <textarea
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[80px]"
                onChange={(e) => update("scheduleDetails", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-800">
                Order of Events
              </label>
              <textarea
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[80px]"
                onChange={(e) => update("orderOfEvents", e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-stone-800">
                  Stock Contractor *
                </label>
                <input
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                  onChange={(e) => update("stockContractor", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-800">
                  Judges
                </label>
                <input
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                  onChange={(e) => update("judges", e.target.value)}
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
                    <input
                      type="radio"
                      name="electrical"
                      value="Available"
                      onChange={(e) => update("electrical", e.target.value)}
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="electrical"
                      value="None"
                      onChange={(e) => update("electrical", e.target.value)}
                    />
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
                    <input
                      type="radio"
                      name="stalls"
                      value="Yes"
                      onChange={(e) => update("stalls", e.target.value)}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stalls"
                      value="No"
                      onChange={(e) => update("stalls", e.target.value)}
                    />
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
                    <input
                      type="radio"
                      name="selfPenning"
                      value="Permitted"
                      onChange={(e) => update("selfPenning", e.target.value)}
                    />
                    Permitted
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selfPenning"
                      value="Not Allowed"
                      onChange={(e) => update("selfPenning", e.target.value)}
                    />
                    Not Allowed
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-800">
                Stall/Camping Booking Contact Info
              </label>
              <input
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                onChange={(e) => update("stallContact", e.target.value)}
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
                <label className="text-sm font-medium text-stone-800">
                  Official Committee Name *
                </label>
                <input
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                  onChange={(e) => update("committeeName", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-800">
                  Primary Contact Person *
                </label>
                <input
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                  onChange={(e) => update("primaryContact", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-800">
                Mailing Address
              </label>
              <input
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                onChange={(e) => update("mailingAddress", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-800">
                Contact Phone / Email *
              </label>
              <input
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                onChange={(e) => update("contactPhoneEmail", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-800">
                Directions to Grounds (for map/GPS)
              </label>
              <textarea
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[80px]"
                onChange={(e) => update("directions", e.target.value)}
              />
            </div>
          </section>

          {/* 6. Medical & Fees */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-900">
              6. Medical & Fees
            </h2>

            <div>
              <label className="text-sm font-medium text-stone-800">
                On-site Medical Provider *
              </label>
              <input
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                onChange={(e) => update("medicalProvider", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-800">
                Association Fees
              </label>
              <textarea
                className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1 min-h-[60px]"
                onChange={(e) => update("associationFees", e.target.value)}
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
              regulations. We understand that this application is subject to
              CCRA board approval."
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-stone-800">
                  Electronic Signature *
                </label>
                <input
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                  onChange={(e) => update("signature", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-800">
                  Date Signed *
                </label>
                <input
                  required
                  type="date"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 mt-1"
                  onChange={(e) => update("dateSigned", e.target.value)}
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
                    className={`border rounded-md px-4 py-3 flex items-center gap-3 cursor-pointer transition
                    ${
                      form.payment === method
                        ? "border-orange-600 bg-orange-50"
                        : "border-stone-300 bg-white hover:bg-stone-100"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={form.payment === method}
                      onChange={(e) => update("payment", e.target.value)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium text-stone-800">
                      {method}
                    </span>
                  </label>
                ))}
              </div>

              {errors.payment && (
                <p className="text-red-600 text-sm mt-1">{errors.payment}</p>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Approval Request"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
