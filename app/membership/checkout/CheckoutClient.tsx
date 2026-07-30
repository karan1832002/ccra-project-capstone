"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();

  const prices = {
    full: "$75 / year",
    associate: "$50 / year",
    junior: "$40 / year",
    lifetime: "$300 one-time",
  } as const;

  type MembershipKey = keyof typeof prices;

  const membershipType = (params.get("type") || "full") as MembershipKey;

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleComplete() {
    setLoading(true);
    setErrorMsg("");

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    try {
      const res = await fetch("http://4.248.243.149/api/memberships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "11111111-1111-1111-1111-111111111111",
          membershipType,
          startDate: startDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save membership");
        return;
      }

      setDone(true);
    } catch {
      setErrorMsg("Network or server error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl shadow-md p-10 text-center relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-orange-600 rounded-t-xl"></div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registration Complete
          </h1>

          <p className="text-gray-700 text-lg mb-6">
            Your membership has been saved successfully!
          </p>

          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly.
          </p>

          <button
            onClick={() => router.push("/membership")}
            className="w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Back to Membership Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-center text-4xl font-bold text-orange-700">
          Membership Checkout
        </h1>

        <p className="text-center text-lg text-gray-600">
          Review your membership details before completing your registration.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            {membershipType.charAt(0).toUpperCase() +
              membershipType.slice(1)}{" "}
            Membership
          </h2>

          <p className="mb-4 text-lg text-gray-700">
            <strong>Price:</strong> {prices[membershipType]}
          </p>

          <p className="mb-2 text-sm text-gray-600">Benefits</p>

          <ul className="mb-6 ml-6 list-disc text-gray-800">
            <li>Access to all CCRA rodeo events</li>
            <li>Member standings & payouts</li>
            <li>Exclusive updates & newsletters</li>
          </ul>

          {errorMsg && (
            <p className="mb-4 font-medium text-red-600">{errorMsg}</p>
          )}

          <button
            className="mb-4 w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Registration"}
          </button>

          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition w-full"
            onClick={() => router.push("/membership")}
          >
            Back to Application
          </button>

        </div>
      </div>
    </div>
  );
}
