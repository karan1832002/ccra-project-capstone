"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MembershipDetailsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<any>(null);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/auth/get-session");
      const data = await res.json();

      if (!data?.user) {
        router.push("/sign-in");
        return;
      }

      setSession(data.user);
      setLoading(false);
    }

    loadSession();
  }, [router]);

  useEffect(() => {
    if (!session) return;

    async function loadMembership() {
      const res = await fetch(
        `http://4.248.243.149/api/memberships/user/${session.id}`
      );
      const data = await res.json();

      if (data.length === 0) {
        setMembership(null);
      } else {
        setMembership(data[data.length - 1]);
      }
    }

    loadMembership();
  }, [session]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!membership) {
    return (
      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Membership Details</h1>
        <p className="text-gray-600">
          You do not have any membership yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Membership Details
      </h1>

      <div className="border rounded-xl p-6 shadow-sm bg-white">
        <p className="text-gray-700 mb-4">
          <strong>Membership Type:</strong> {membership.membershipType}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Status:</strong> {membership.status}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Start Date:</strong> {membership.startDate}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Expiry Date:</strong> {membership.expiryDate}
        </p>

        {membership.status === "cancelled" && (
          <p className="text-red-600 mb-4">
            You cannot rejoin until 6 months after cancellation.
          </p>
        )}

        {membership.status !== "cancelled" && (
          <button
            onClick={() => router.push("/membership/cancel")}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg w-full"
          >
            Cancel Membership
          </button>
        )}
      </div>
    </div>
  );
}
