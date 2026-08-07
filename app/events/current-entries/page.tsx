"use client";

import { useEffect, useState } from "react";
import { CurrentEntriesTable } from "@/components/rodeo/CurrentEntriesTable";
import SearchAndFilterBar from "@/components/ui/SearchAndFilterBar";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";
import { getEventRegistrations, Registration } from "@/lib/gateway";

export default function CurrentEntriesPage() {
  // Fetch current registrations from the API.
  const [entries, setEntries] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getEventRegistrations();
        setEntries(data);
      } catch (err) {
        setError("Unable to load current entries.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.competitorName?.toLowerCase().includes(search.toLowerCase()) ??
      false;

    const matchesCategory = category === "all" || entry.category === category;

    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { label: "All events", value: "all" },
    ...Array.from(new Set(entries.map((entry) => entry.category))).map(
      (category) => ({
        label: category,
        value: category,
      }),
    ),
  ];

  return (
    <main className={pageStructure.pageWrapper}>
      <Hero
        badge="UPCOMING RODEOS"
        title="Current Entries"
        description="Check out the latest lineup of competitors for upcoming rodeos. Entries are updated as they come in, so check back often."
      />

      <div className={pageStructure.contentContainer}>
        <div className="mx-auto max-w-3xl">
          <SearchAndFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search competitors..."
            filterValue={category}
            onFilterChange={setCategory}
            filterOptions={categoryOptions}
          />
          <CurrentEntriesTable entries={filteredEntries} />
        </div>
      </div>
    </main>
  );
}
