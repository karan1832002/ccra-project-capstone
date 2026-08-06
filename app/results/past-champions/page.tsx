"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/ui/Hero";
import PastChampionsTable from "@/components/rodeo/PastChampionsTable";
import { pageStructure } from "@/lib/styles";
import { getResults, Result } from "@/lib/gateway";
import Link from "next/link";

export default function PastChampionsPage() {
  // All recorded results used to determine season champions.
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await getResults();
        setResults(data);
      } catch (error) {
        console.error("Failed to load past champions:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 px-4">
        <p className="text-sm text-muted-foreground">
          Loading past champions...
        </p>
      </div>
    );
  }

  return (
    <div className={pageStructure.pageWrapper}>
      <Hero
        badge="CCRA HISTORY"
        title="Past Champions"
        description="Honoring outstanding competitors who have earned championship titles throughout the history of the Canadian Classic Rodeo Association."
      />

      <div className={pageStructure.contentContainer}>
        <div className="mx-auto max-w-3xl">
          <PastChampionsTable entries={results} />
        </div>

        {/* Info Boxes */}
        <div className="my-12">
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
        </div>
      </div>
    </div>
  );
}
