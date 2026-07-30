"use client";

import React from "react";
import Link from "next/link";
import Hero from "@/components/ui/Hero";

export default function PastChampionsPage() {
  const champions = [
    { year: 2024, name: "Aimee Cripps", region: "Alberta" },
    { year: 2023, name: "Jill Flynn", region: "Saskatchewan" },
    { year: 2022, name: "Jackie Hoover", region: "British Columbia" },
    { year: 2021, name: "Sarah Miller", region: "Alberta" },
    { year: 2020, name: "Karen Thompson", region: "Alberta" },
    { year: 2019, name: "Lisa Veldman", region: "Manitoba" },
  ];

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <Hero
        badge="CCRA HISTORY"
        title="Past Champions"
        description="Honoring outstanding competitors who have earned championship titles throughout the history of the Canadian Classic Rodeo Association."
      />

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-orange-700">
            Ladies Barrel Racing 40–59
          </h2>
          <button
            onClick={handlePrint}
            className="text-sm text-gray-600 hover:text-orange-700 transition"
          >
            Print
          </button>
        </div>

        <table className="w-full border-collapse text-left text-sm sm:text-base">
          <thead>
            <tr className="bg-stone-100">
              <th className="px-4 py-2 font-medium">Year</th>
              <th className="px-4 py-2 font-medium">Champion Name</th>
              <th className="px-4 py-2 font-medium">Region</th>
            </tr>
          </thead>
          <tbody className="[&>tr:nth-child(even)]:bg-stone-50">
            {champions.map((c) => (
              <tr key={c.year} className="hover:bg-orange-50 transition">
                <td className="px-4 py-2 border-b">{c.year}</td>
                <td className="px-4 py-2 border-b">{c.name}</td>
                <td className="px-4 py-2 border-b">{c.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Boxes */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* 2026 Schedule */}
        <Link
          href="/schedule"
          className="bg-white shadow-md rounded-lg p-5 text-center hover:shadow-lg transition block"
        >
          <h3 className="text-lg font-semibold text-orange-700 mb-2">
            2026 Schedule
          </h3>
          <p className="text-gray-600 text-sm">
            Explore the upcoming 2026 rodeo season and mark your calendar for
            major events.
          </p>
        </Link>

        {/* Official Rulebook */}
        <Link
          href="/rulebook"
          className="bg-white shadow-md rounded-lg p-5 text-center hover:shadow-lg transition block"
        >
          <h3 className="text-lg font-semibold text-orange-700 mb-2">
            Official Rulebook
          </h3>
          <p className="text-gray-600 text-sm">
            Review the official CCRA competition rules and standards for all
            event categories.
          </p>
        </Link>
      </div>
    </div>
  );
}
