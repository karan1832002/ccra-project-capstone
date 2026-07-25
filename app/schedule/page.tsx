"use client";

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      {/* Page Heading */}
      <h1 className="text-5xl font-semibold text-stone-950 mb-6">
        Rodeo Schedule
      </h1>
      <p className="text-stone-600 text-sm max-w-3xl mb-12">
        Stay up to date with event dates, entry windows, and performance times for the 2026 rodeo season.
      </p>

      {/* Schedule Table */}
      <div className="rounded-md border border-stone-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-stone-600">
          <thead className="bg-stone-50 text-stone-950">
            <tr>
              <th className="p-4 text-left">Rodeo Name</th>
              <th className="p-4 text-left">Performances</th>
              <th className="p-4 text-left">Entries Open</th>
              <th className="p-4 text-left">Phone-in Entries</th>
              <th className="p-4 text-left">Entries Close</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-200">
            {[
              ["Southwest Senior Rodeo", "May 16–18, 2026", "04/29/2026", "05/06/2026", "05/06/2026"],
              ["Pincher Creek Rodeo", "July 12–13, 2026", "06/24/2026", "07/01/2026", "07/01/2026"],
              ["Standoff Rodeo", "July 14, 2026", "06/24/2026", "07/01/2026", "07/01/2026"],
              ["Dunmore Timed Event", "July 17–19, 2026", "07/01/2026", "07/08/2026", "07/08/2026"],
              ["Stettler CCRA Rodeo", "Aug 13, 2026", "07/29/2026", "08/05/2026", "08/05/2026"],
              ["Winfield CCRA Rodeo", "Aug 14–16, 2026", "07/29/2026", "08/05/2026", "08/05/2026"],
              ["Galloways CCRA Rodeo", "Aug 14, 2026", "07/29/2026", "08/05/2026", "08/05/2026"],
              ["Cardston Academy Rodeo", "Aug 22–23, 2026", "08/05/2026", "08/12/2026", "08/12/2026"],
              ["CCRA Finals", "Oct 15–18, 2026", "09/02/2026", "09/09/2026", "09/09/2026"],
            ].map(([name, perf, open, phone, close], i) => (
              <tr key={i} className="hover:bg-stone-50 transition">
                <td className="p-4 font-medium text-stone-950">{name}</td>
                <td className="p-4">{perf}</td>

                <td className="p-4">
                  <span className="rounded-md bg-orange-50 px-2 py-1 text-xs text-orange-700">
                    {open}
                  </span>
                </td>

                <td className="p-4">
                  <span className="rounded-md bg-orange-50 px-2 py-1 text-xs text-orange-700">
                    {phone}
                  </span>
                </td>

                <td className="p-4">
                  <span className="rounded-md bg-orange-50 px-2 py-1 text-xs text-orange-700">
                    {close}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Footer */}
      <footer className="mt-20 border-t border-stone-200 pt-12">
        <p className="text-sm text-stone-600 text-center">
          © 2026 Canadian Classic Rodeo Association. All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}
