import { CurrentEntriesTable } from "@/components/rodeo/CurrentEntriesTable";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";
import {
  getCurrentEntriesForUpcomingRodeos,
  getRodeoEvents,
} from "@/lib/sampleRodeoData";

export default async function CurrentEntriesPage() {
  const [entries, rodeos] = await Promise.all([
    getCurrentEntriesForUpcomingRodeos(),
    getRodeoEvents(),
  ]);

  return (
    <main className={pageStructure.pageWrapper}>
      <Hero
        badge="UPCOMING RODEOS"
        title="Current Entries"
        description="Check out the latest lineup of competitors for upcoming rodeos. Entries are updated as they come in, so check back often."
      />

      <div className={pageStructure.contentContainer}>
        <CurrentEntriesTable entries={entries} rodeos={rodeos} />
      </div>
    </main>
  );
}
