"use client";

import { useMemo, useState } from "react";

const partners = [
  {
    name: "Wrangler",
    category: "Apparel",
    website: "https://www.wrangler.com",
    description: "Official western apparel partner.",
  },
  {
    name: "Coors Banquet",
    category: "Beverage",
    website: "https://www.coors.com",
    description: "Proud supporter of rodeo events.",
  },
  {
    name: "Boot Barn",
    category: "Retail",
    website: "https://www.bootbarn.com",
    description: "Western wear and cowboy boots.",
  },
  {
    name: "RAM Trucks",
    category: "Automotive",
    website: "https://www.ramtrucks.com",
    description: "Official truck partner.",
  },
  {
    name: "Canadian Western Bank",
    category: "Finance",
    website: "https://www.cwb.com",
    description: "Supporting Canadian rodeo communities.",
  },
];

export default function PartnerSearchPage() {
  const [search, setSearch] = useState("");

  const filteredPartners = useMemo(() => {
    return partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(search.toLowerCase()) ||
        partner.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Page Header */}
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-orange-700">
          Partner Search
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-stone-600">
        Browse official Canadian Classic Rodeo Association partners,
         sponsors, and approved businesses.
        </p>
      </section>

      <div className="mb-10">
        <input
          type="text"
          placeholder="Search partners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filteredPartners.map((partner) => (
          <div
            key={partner.name}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {partner.name}
              </h2>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                {partner.category}
              </span>
            </div>

            <p className="mt-4 text-sm text-stone-600">
              {partner.description}
            </p>

            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Visit Website
            </a>
          </div>
        ))}

      </div>

      {filteredPartners.length === 0 && (
        <div className="py-16 text-center text-stone-500">
          No partners found.
        </div>
      )}

    </main>
  );
}