"use client";

import React from "react";
import Hero from "@/components/ui/Hero";
import { buttons, pageStructure } from "@/lib/styles";

const downloads = [
  {
    title: "CCRA 2025 Rulebook",
    description: "Complete rulebook for all sanctioned CCRA rodeo events.",
    href: "/pdfs/offical rule book.pdf",
    cta: "Download Rulebook",
  },
  {
    title: "CCRA Bylaws",
    description:
      "Official bylaws governing the Canadian Classic Rodeo Association.",
    href: "/pdfs/ccra  bylaws.pdf",
    cta: "Download Bylaws",
  },
  {
    title: "Rule Change Form",
    description: "Submit proposed changes to the official CCRA rulebook.",
    href: "/pdfs/rule change from.pdf",
    cta: "Download Form",
  },
];

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
          {downloads.map(({ title, description, href, cta }) => (
            <div
              key={href}
              className="bg-surface shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-heading-text mb-2">
                {title}
              </h2>
              <p className="text-body-text mb-4">{description}</p>
              <a
                href={href}
                target="_blank"
                className={buttons.primaryButton}
              >
                {cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
