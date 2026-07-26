// app/schedule/page.tsx
//
// Server Component: fetches rodeos from the gateway and renders them as a
// polished schedule. Uses the site's stone/orange palette and leather-shadow.

import { getRodeos, GatewayError, type Rodeo } from "@/lib/gateway";

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

// Entry status derived from today vs the open/close window.
function entryStatus(open: string | null, close: string | null) {
  const today = new Date().toISOString().slice(0, 10);
  if (open && today < open) return { label: "Opens soon", tone: "upcoming" };
  if (close && today > close) return { label: "Entries closed", tone: "closed" };
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
    error = err instanceof GatewayError ? err.message : "Unable to load the schedule right now.";
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero band */}
      <header className="border-b border-stone-200 bg-gradient-to-b from-white to-stone-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600 mb-3">
            2026 Season
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-stone-950">
            Rodeo Schedule
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Event dates, entry windows, and performance times for the upcoming
            CCRA season. Entries close automatically after each rodeo&apos;s
            deadline.
          </p>
        </div>
      </header>

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
            {/* Desktop: table. Mobile: cards. */}
            <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white leather-shadow md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/80">
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
                      <tr key={r.id} className="group transition-colors hover:bg-orange-50/40">
                        <td className="px-6 py-5">
                          <div className="font-semibold text-stone-950">{r.rodeoTitle}</div>
                          {r.entryFee != null && (
                            <div className="mt-0.5 text-xs text-stone-500">
                              Entry fee ${r.entryFee}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-stone-600">{r.location}</td>
                        <td className="px-6 py-5 text-stone-600">{fmtLong(r.entriesOpen)}</td>
                        <td className="px-6 py-5 text-stone-600">{fmtLong(r.entriesClose)}</td>
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

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {rodeos.map((r) => {
                const status = entryStatus(r.entriesOpen, r.entriesClose);
                return (
                  <div key={r.id} className="rounded-2xl border border-stone-200 bg-white p-5 leather-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-stone-950">{r.rodeoTitle}</h2>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneStyles[status.tone]}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">{r.location}</p>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-stone-400">Opens</dt>
                        <dd className="mt-0.5 text-stone-700">{fmtLong(r.entriesOpen)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-stone-400">Closes</dt>
                        <dd className="mt-0.5 text-stone-700">{fmtLong(r.entriesClose)}</dd>
                      </div>
                    </dl>
                    {r.entryFee != null && (
                      <p className="mt-3 text-xs text-stone-500">Entry fee ${r.entryFee}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="mt-8 text-center text-sm text-stone-400">
          Showing {rodeos.length} {rodeos.length === 1 ? "rodeo" : "rodeos"} for the 2026 season
        </p>
      </main>

      <footer className="border-t border-stone-200 py-10">
        <p className="text-center text-sm text-stone-500">
          © 2026 Canadian Classic Rodeo Association. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}