/**
 * Table
 * -----
 * A reusable table component that renders data using a supplied set of
 * columns and rows.
 *
 * Supports configurable column widths, text wrapping, and text alignment,
 * allowing multiple tables to share a consistent layout while remaining
 * generic and reusable.
 *
 * IMPORTANT: `data` rows are rendered positionally using `Object.values(row)`,
 * not matched by key name, so each row object's property insertion order
 * must exactly match the `columns` array order.
 *
 * Used by:
 * - components/rodeo/CurrentEntriesTable.tsx
 * - components/rodeo/PastChampionsTable.tsx
 * - components/rodeo/ResultsTable.tsx
 * - components/rodeo/StandingsTable.tsx
 */

import React from "react";

interface TableProps<T extends Record<string, React.ReactNode>> {
  columns: string[]; // Table headers
  data: T[]; // Table data (order must match columns order)
  columnWidths?: readonly string[]; // Percentage width for each column
  wrapColumns?: readonly number[]; // Column indexes that allow text wrapping
  alignColumns?: readonly ("left" | "center" | "right")[]; // Text alignment for each column
}

function Table<T extends Record<string, React.ReactNode>>({
  columns,
  data,
  columnWidths,
  wrapColumns = [],
  alignColumns = [],
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-md border border-border shadow-sm w-full">
      <table className="w-full divide-y divide-border">
        {/* Apply optional column widths for consistent layouts across tables */}
        {columnWidths && (
          <colgroup>
            {columnWidths.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
        )}

        {/* Table Headers */}
        <thead className="bg-primary">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-1 py-5 first:pl-5 last:pr-3 text-sm font-semibold text-primary-text uppercase tracking-wider ${
                  alignColumns?.[index] === "left"
                    ? "text-left"
                    : alignColumns?.[index] === "right"
                      ? "text-right"
                      : "text-center"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Data */}
        <tbody className="divide-y divide-border">
          {data.map((row, rowIndex) => (
            // Alternate row colors to improve readability.
            <tr
              key={rowIndex}
              className={`${rowIndex % 2 === 0 ? "bg-surface" : "bg-highlight"} hover:bg-accent`}
            >
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-1 py-3 first:pl-5 last:pr-5 text-sm text-body-text ${
                    wrapColumns.includes(cellIndex)
                      ? "whitespace-normal"
                      : "whitespace-nowrap"
                  } ${
                    alignColumns?.[cellIndex] === "left"
                      ? "text-left"
                      : alignColumns?.[cellIndex] === "right"
                        ? "text-right"
                        : "text-center"
                  }`}
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
