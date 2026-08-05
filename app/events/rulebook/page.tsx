"use client";

import React from "react";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";

export default function RulebookPage() {
  return (
    <div className={pageStructure.pageWrapper}>
      {/* Header */}
      <Hero
        badge="RULES & REGULATIONS"
        title="Official Rulebook"
        description="Access the official Canadian Classic Rodeo Association rulebook, bylaws, and rule change forms."
      />

      <div className={pageStructure.contentContainer}>
        {/* Downloads Section */}
        <div className="space-y-6">
          {/* Rulebook PDF */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">
              CCRA 2025 Rulebook
            </h2>
            <p className="text-gray-600 mb-4">
              Complete rulebook for all sanctioned CCRA rodeo events.
            </p>
            <a
              href="/pdfs/offical rule book.pdf"
              target="_blank"
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              Download Rulebook
            </a>
          </div>

          {/* Bylaws */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">
              CCRA Bylaws
            </h2>
            <p className="text-gray-600 mb-4">
              Official bylaws governing the Canadian Classic Rodeo Association.
            </p>
            <a
              href="/pdfs/ccra  bylaws.pdf"
              target="_blank"
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              Download Bylaws
            </a>
          </div>

          {/* Rule Change Form */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">
              Rule Change Form
            </h2>
            <p className="text-gray-600 mb-4">
              Submit proposed changes to the official CCRA rulebook.
            </p>
            <a
              href="/pdfs/rule change from.pdf"
              target="_blank"
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              Download Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
