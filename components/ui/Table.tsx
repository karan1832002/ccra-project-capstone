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
    <div className="overflow-x-auto rounded-md border border-border shadow-sm w-full">
      <table className="w-full divide-y divide-border">
        {/* Table Headers */}
        <thead className="bg-primary">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-center text-sm font-semibold text-primary-foreground uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Data */}
        <tbody className="divide-y divide-border">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowIndex % 2 === 0 ? "bg-surface" : "bg-highlight"} hover:bg-accent`}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
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