"use client";

import React from "react";
import Link from "next/link";

export default function FinalsResultsPage() {
  const finals = [
    { event: "Ladies Barrel Racing 40–59", champion: "Aimee Cripps", region: "Alberta" },
    { event: "Ladies Barrel Racing 60+", champion: "Jill Flynn", region: "Saskatchewan" },
    { event: "Men’s Breakaway Roping 40–64", champion: "Jackie Hoover", region: "British Columbia" },
    { event: "Team Roping 40–59 Header", champion: "Sarah Miller", region: "Alberta" },
    { event: "Team Roping 40–59 Heeler", champion: "Karen Thompson", region: "Alberta" },
    { event: "Saddle Bronc", champion: "Lisa Veldman", region: "Manitoba" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-orange-700 mb-2">
        Finals Results
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Official champions crowned at the Canadian Classic Rodeo Association Finals.
      </p>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-orange-700">
            2026 Finals Champions
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
              <th className="px-4 py-2 font-medium">Event</th>
              <th className="px-4 py-2 font-medium">Champion</th>
              <th className="px-4 py-2 font-medium">Region</th>
            </tr>
          </thead>
          <tbody className="[&>tr:nth-child(even)]:bg-stone-50">
            {finals.map((f, idx) => (
              <tr key={idx} className="hover:bg-orange-50 transition">
                <td className="px-4 py-2 border-b">{f.event}</td>
                <td className="px-4 py-2 border-b">{f.champion}</td>
                <td className="px-4 py-2 border-b">{f.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Boxes */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/schedule"
          className="bg-white shadow-md rounded-lg p-5 text-center hover:shadow-lg transition block"
        >
          <h3 className="text-lg font-semibold text-orange-700 mb-2">
            2026 Schedule
          </h3>
          <p className="text-gray-600 text-sm">
            Explore the upcoming rodeo season and major events.
          </p>
        </Link>

        <Link
          href="/rulebook"
          className="bg-white shadow-md rounded-lg p-5 text-center hover:shadow-lg transition block"
        >
          <h3 className="text-lg font-semibold text-orange-700 mb-2">
            Official Rulebook
          </h3>
          <p className="text-gray-600 text-sm">
            Review the official CCRA competition rules and standards.
          </p>
        </Link>
      </div>
    </div>
  );
}
