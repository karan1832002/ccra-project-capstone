import { getRodeos, GatewayError, type Rodeo } from "@/lib/gateway";
import Hero from "@/components/ui/Hero";

export const metadata = { title: "Rodeo Schedule | CCRA" };

function fmtLong(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function entryStatus(open: string | null, close: string | null) {
  const today = new Date().toISOString().slice(0, 10);
  if (open && today < open) return { label: "Opens soon", tone: "upcoming" };
  if (close && today > close)
    return { label: "Entries closed", tone: "closed" };
  if (open && close) return { label: "Entries open", tone: "open" };
  return { label: "TBA", tone: "tba" };
}

const toneStyles: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  closed: "bg-stone-100 text-stone-500 ring-stone-500/20",
  upcoming: "bg-amber-50 text-amber-700 ring-amber-600/20",
  tba: "bg-stone-50 text-stone-400 ring-stone-400/20",
};

export default async function SchedulePage() {
  let rodeos: Rodeo[] = [];
  let error: string | null = null;

  try {
    rodeos = await getRodeos();
  } catch (err) {
    error =
      err instanceof GatewayError
        ? err.message
        : "Unable to load the schedule right now.";
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <Hero
        badge="2026 SEASON"
        title="Rodeo Schedule"
        description="View official dates, entry windows, and performance times for all Canadian Classic Rodeo Association sanctioned rodeos."
      />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
            {error}
          </div>
        )}

        {rodeos.length === 0 && !error ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 py-24 text-center">
            <p className="text-lg font-medium text-stone-500">
              No rodeos scheduled yet
            </p>
            <p className="mt-1 text-sm text-stone-400">
              Check back soon — the season lineup is being finalized.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Rodeo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Entries Open
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Entries Close
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {rodeos.map((r) => {
                    const status = entryStatus(r.entriesOpen, r.entriesClose);
                    return (
                      <tr
                        key={r.id}
                        className="transition-colors hover:bg-orange-50/40"
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold text-stone-950">
                            {r.rodeoTitle}
                          </div>
                          {r.entryFee != null && (
                            <div className="mt-0.5 text-xs text-stone-500">
                              Entry fee ${r.entryFee}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-stone-600">
                          {r.location}
                        </td>
                        <td className="px-6 py-5 text-stone-600">
                          {fmtLong(r.entriesOpen)}
                        </td>
                        <td className="px-6 py-5 text-stone-600">
                          {fmtLong(r.entriesClose)}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${toneStyles[status.tone]}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {rodeos.map((r) => {
                const status = entryStatus(r.entriesOpen, r.entriesClose);
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-stone-950">
                        {r.rodeoTitle}
                      </h2>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneStyles[status.tone]}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-stone-500">{r.location}</p>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-stone-400">
                          Opens
                        </dt>
                        <dd className="mt-0.5 text-stone-700">
                          {fmtLong(r.entriesOpen)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-stone-400">
                          Closes
                        </dt>
                        <dd className="mt-0.5 text-stone-700">
                          {fmtLong(r.entriesClose)}
                        </dd>
                      </div>
                    </dl>

                    {r.entryFee != null && (
                      <p className="mt-3 text-xs text-stone-500">
                        Entry fee ${r.entryFee}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="mt-8 text-center text-sm text-stone-400">
          Showing {rodeos.length} {rodeos.length === 1 ? "rodeo" : "rodeos"} for
          the 2026 season
        </p>
      </main>
    </div>
  );
}
