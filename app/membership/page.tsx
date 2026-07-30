"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/ui/Hero";

export default function MembershipPage() {
  const router = useRouter();

  type MembershipType = "full" | "associate" | "junior" | "lifetime";

  const prices: Record<MembershipType, string> = {
    full: "$75 / year",
    associate: "$50 / year",
    junior: "$40 / year",
    lifetime: "$300 one-time",
  };

  const [membershipType, setMembershipType] = useState<MembershipType>("full");

  function handleContinue() {
    router.push(`/membership/checkout?type=${membershipType}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero
        badge="JOIN THE CCRA"
        title="Membership Application"
        description="Become a CCRA member to compete in sanctioned rodeos, earn season points, and be part of a community dedicated to western sports and competition."
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="border rounded-xl p-8 shadow-sm bg-white">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Membership Type
          </label>

          <select
            value={membershipType}
            onChange={(e) =>
              setMembershipType(e.target.value as MembershipType)
            }
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 mb-6"
          >
            <option value="full">Full Membership</option>
            <option value="associate">Associate Membership</option>
            <option value="junior">Junior Membership</option>
            <option value="lifetime">Lifetime Membership</option>
          </select>

          <div className="mb-6">
            <p className="text-gray-600 text-sm">Price</p>
            <p className="text-2xl font-bold text-gray-900">
              {prices[membershipType]}
            </p>
          </div>

          <button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition w-full"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
