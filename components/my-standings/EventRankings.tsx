import { Trophy } from "lucide-react";

export type EventStanding = {
  event: string;
  points: number;
  rank: number;
  entries: number;
  bestScore: string | number;
  lastResult: string;
};

interface EventRankingsProps {
  items: EventStanding[];
  title?: string;
  label?: string;
  className?: string;
}

export default function EventRankings({
  items,
  title = "Event Rankings",
  label = "BY CATEGORY",
  className = "",
}: EventRankingsProps) {
  return (
    <section
      className={`rounded-md border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900 ${className}`}
    >
      <div className="uppercase tracking-[0.18em] text-xs font-semibold text-stone-400 mb-3 dark:text-stone-500">
        {label}
      </div>
      <h2 className="text-xl font-semibold text-stone-950 mb-6 dark:text-stone-100">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          No event rankings yet.
        </p>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <div
              key={item.event}
              className="rounded-md border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-stone-950 dark:text-stone-100">
                    {item.event}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1 dark:text-stone-400">
                    Last: {item.lastResult}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                  <Trophy className="w-3.5 h-3.5" />
                  Rank #{item.rank}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-semibold text-stone-950 dark:text-stone-100">
                    {item.points}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Points
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-stone-950 dark:text-stone-100">
                    {item.entries}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Entries
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-stone-950 dark:text-stone-100">
                    {item.bestScore}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Best Score
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}