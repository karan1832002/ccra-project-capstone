import { CurrentEntriesTable } from "@/components/rodeo/CurrentEntriesTable";
import { getCurrentEntriesForUpcomingRodeos, getRodeoEvents } from "@/lib/sampleRodeoData";

export default async function CurrentEntriesPage() {
  const [entries, rodeos] = await Promise.all([
    getCurrentEntriesForUpcomingRodeos(),
    getRodeoEvents(),
  ]);

  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-stone-950 mb-6">
        Current Entries
      </h1>
      <CurrentEntriesTable entries={entries} rodeos={rodeos} />
    </main>
  );
}