import Hero from "@/components/ui/Hero";
import MinuteEntry from "@/components/ui/MinuteEntry";
import { getMinutes } from "@/lib/gateway";

export const revalidate = 60; // ISR — refresh every 60 seconds

export default async function MinutesPage() {
  const minutes = await getMinutes();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <Hero
        badge="GOVERNANCE"
        title="Meeting Minutes"
        description="Official records of Board of Directors meetings for the Canadian Classic Rodeo Association."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {minutes.map((entry) => (
            <MinuteEntry key={entry.id} entry={entry} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Minutes are published after approval by the Board. For older records or official
            copies, please{" "}
            <a
              href="/about-us/contact"
              className="text-orange-600 hover:underline dark:text-orange-400"
            >
              contact the office
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}