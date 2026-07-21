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
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm inline-block">
      <table className="divide-y divide-gray-200">
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
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
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
