import { TrendingUp } from "lucide-react";

export type RecentResult = {
  date: string;
  rodeo: string;
  event: string;
  place: string;
  points: number;
};

interface RecentResultsProps {
  items: RecentResult[];
  title?: string;
  label?: string;
  className?: string;
}

export default function RecentResults({
  items,
  title = "Latest Results",
  label = "RECENT",
  className = "",
}: RecentResultsProps) {
  return (
    <section
      className={`rounded-md border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900 ${className}`}
    >
      <div className="uppercase tracking-[0.18em] text-xs font-semibold text-stone-600 mb-3 dark:text-stone-600">
        {label}
      </div>
      <h2 className="text-xl font-semibold text-stone-950 mb-6 dark:text-stone-100">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-stone-600 dark:text-stone-600">
          No recent results yet.
        </p>
      ) : (
        <div className="space-y-5">
          {items.map((result, index) => (
            <div
              key={`${result.rodeo}-${result.date}-${index}`}
              className="flex gap-4 pb-5 border-b border-stone-200 last:border-0 last:pb-0 dark:border-stone-700"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-stone-950 dark:text-stone-100">
                    {result.rodeo}
                  </p>
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    {result.place}
                  </span>
                </div>
                <p className="text-sm text-stone-600 mt-0.5 dark:text-stone-600">
                  {result.event}
                </p>
                <p className="text-xs text-stone-600 mt-1 dark:text-stone-600">
                  {result.date} · +{result.points} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}