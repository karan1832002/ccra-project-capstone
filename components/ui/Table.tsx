/**
 * Table
 * -----
 * A generic table shell: renders whatever `columns` and `data` it's given,
 * with zebra-striped rows and an orange header. Has no idea what domain the
 * data belongs to — callers reshape their own records into plain row
 * objects before passing them in.
 *
 * IMPORTANT: `data` rows are rendered positionally via Object.values(row),
 * not matched by key name — so each row object's property insertion order
 * must exactly match the `columns` array order.
 *
 * Used by:
 * - components/rodeo/ResultsTable.tsx
 */

import React from "react";

interface TableProps<T extends Record<string, React.ReactNode>> {
  columns: string[]; // Table headers
  data: T[]; // Table data (order must match columns order)
}

function Table<T extends Record<string, React.ReactNode>>({
  columns,
  data,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-md border border-stone-200 shadow-sm inline-block">
      <table className="divide-y divide-stone-200">
        {/* Table Headers */}
        <thead className="bg-orange-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Data */}
        <tbody className="divide-y divide-stone-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-stone-50"} hover:bg-orange-50`}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-stone-600"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
