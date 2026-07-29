import { CurrentEntriesTable } from "@/components/rodeo/CurrentEntriesTable";
import Hero from "@/components/ui/Hero";
import { getCurrentEntriesForUpcomingRodeos, getRodeoEvents } from "@/lib/sampleRodeoData";

export default async function CurrentEntriesPage() {
  const [entries, rodeos] = await Promise.all([
    getCurrentEntriesForUpcomingRodeos(),
    getRodeoEvents(),
  ]);

  return (
    <main className="p-8 flex flex-col items-center">
      <Hero
        badge="UPCOMING RODEOS"
        title="Current Entries"
        description="Check out the latest lineup of competitors for upcoming rodeos. Entries are updated as they come in, so check back often."
      />
      <CurrentEntriesTable entries={entries} rodeos={rodeos} />
    </main>
  );
}