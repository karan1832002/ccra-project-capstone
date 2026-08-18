"use client";

import React, { useState, useEffect } from "react";
import { pageStructure, cards } from "@/lib/styles";
import Hero from "@/components/ui/Hero";

interface Director {
  name: string;
  role: string;
  location: string;
  bio: string;
  longBio?: string;
}

const directors: Director[] = [
  {
    name: "Tom Thielen",
    role: "President",
    location: "Alberta",
    bio: "Long-time competitor and dedicated leader of the CCRA.",
    longBio:
      "Tom has been a cornerstone of the Canadian Classic Rodeo Association for many years. As President he guides the board with a focus on fairness, growth, and preserving the Western lifestyle. He is widely respected by competitors and committees alike.",
  },
  {
    name: "Sandy Creasy",
    role: "Vice President",
    location: "Alberta",
    bio: "Active competitor and strong advocate for the membership.",
    longBio:
      "Sandy brings both competitive experience and a deep understanding of the membership’s needs. She works closely with the President to ensure the association continues to serve athletes of every level.",
  },
  {
    name: "Niki Makofka",
    role: "Secretary",
    location: "Alberta",
    bio: "2024 Cowgirl of the Year and passionate board member.",
    longBio:
      "Niki is a highly accomplished competitor and the 2024 Cowgirl of the Year. As Secretary she keeps the association organized and is a strong voice for competitors on the board.",
  },
  {
    name: "Joe Fisher",
    role: "Director",
    location: "Alberta",
    bio: "Steer Wrestling competitor and experienced board member.",
    longBio:
      "Joe is a respected Steer Wrestling competitor who brings practical arena experience and steady leadership to the board table.",
  },
  {
    name: "Marina Eckert",
    role: "Director",
    location: "Alberta",
    bio: "Committed to growing the association and supporting events.",
    longBio:
      "Marina focuses on event support and membership growth. She is known for her positive energy and willingness to help wherever needed.",
  },
  {
    name: "Charity Aneca",
    role: "Director",
    location: "Alberta",
    bio: "Dedicated volunteer focused on membership and community.",
    longBio:
      "Charity is deeply involved in community and membership initiatives. She helps keep the CCRA welcoming and well-connected.",
  },
  {
    name: "Nathan Block",
    role: "Director",
    location: "Alberta",
    bio: "Supports the association’s operations and event coordination.",
    longBio:
      "Nathan assists with operational planning and event coordination, ensuring rodeos run smoothly for both competitors and committees.",
  },
  {
    name: "Verle Pahl",
    role: "Director",
    location: "Alberta",
    bio: "Active competitor and valued voice on the board.",
    longBio:
      "Verle competes regularly and brings a competitor’s perspective to board discussions. His insight helps keep decisions grounded in the arena.",
  },
  {
    name: "Reid Miller",
    role: "Director",
    location: "Alberta",
    bio: "Helps guide the strategic direction of the CCRA.",
    longBio:
      "Reid contributes to the long-term vision of the association, helping shape policies that support sustainable growth.",
  },
  {
    name: "Bruce Clayton",
    role: "Director",
    location: "Alberta",
    bio: "Long-standing supporter of senior and classic rodeo.",
    longBio:
      "Bruce has supported the CCRA for many years and continues to advocate for the unique place of classic and senior competitors in Canadian rodeo.",
  },
  {
    name: "Lorne Lausen",
    role: "Director",
    location: "Alberta",
    bio: "Brings experience and dedication to the board table.",
    longBio:
      "Lorne is a steady and experienced board member who contributes practical knowledge and a strong commitment to the association’s values.",
  },
  {
    name: "Connie LeMoine",
    role: "Director",
    location: "Alberta",
    bio: "Active competitor and strong advocate for the sport.",
    longBio:
      "Connie is an active competitor who advocates for fairness and opportunity across all events and age divisions.",
  },
];

export default function BoardOfDirectorsPage() {
  const [selected, setSelected] = useState<Director | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selected]);

  return (
    <div className={pageStructure.pageWrapper}>
      {/* ================= HERO ================= */}
      <Hero
        badge="LEADERSHIP"
        title="Board of Directors"
        description="The Canadian Classic Rodeo Association is guided by a dedicated group of volunteers who give their time to preserve and grow our sport."
      />

      <div className={pageStructure.contentContainer}>
        {/* ================= BOARD GRID ================= */}
        <div className={cards.grid}>
          {directors.map((director) => (
            <button
              key={director.name}
              onClick={() => setSelected(director)}
              className={`${cards.layout} ${cards.interactive}`}
            >
              {/* Avatar initials */}
              <div className={cards.iconContainer}>
                {director.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <h3 className={"text-xl font-semibold text-heading-text"}>
                {director.name}
              </h3>
              <p className="text-sm font-medium text-accent-text mt-1">
                {director.role}
              </p>
              <p className="text-sm text-body-text mt-1">
                {director.location}
              </p>
              <p className="text-body-text mt-4 text-sm leading-relaxed line-clamp-3">
                {director.bio}
              </p>
            </button>
          ))}
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-20 rounded-md border border-border bg-surface p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-heading-text mb-3">
            Interested in Serving?
          </h2>
          <p className="text-body-text max-w-xl mx-auto mb-8">
            The CCRA is always looking for passionate members who want to contribute to the
            future of classic rodeo in Canada.
          </p>
          <a
            href="/about-us/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-text transition hover:bg-primary-dark"
          >
            Contact the Board
          </a>
        </div>
      </div>

      {/* ================= DIRECTOR MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="director-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-overlay-blur backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          />

          {/* Modal panel */}
          <div className="relative w-full max-w-2xl rounded-md border border-border bg-surface shadow-lg overflow-hidden">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-md flex items-center justify-center text-body-text hover:bg-highlight transition"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 sm:p-10">
              <div className="w-24 h-24 rounded-md bg-accent flex items-center justify-center text-4xl font-semibold text-accent-text mb-6">
                {selected.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <h2
                id="director-modal-title"
                className="text-3xl font-semibold text-heading-text"
              >
                {selected.name}
              </h2>
              <p className="text-lg font-medium text-accent-text mt-1">
                {selected.role}
              </p>
              <p className="text-sm text-caption-text mt-1">
                {selected.location}
              </p>

              <div className="mt-8 border-t border-border pt-8">
                <p className="text-body-text leading-relaxed text-base">
                  {selected.longBio || selected.bio}
                </p>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-text transition hover:bg-primary-dark"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}