"use client";

import { useState, useEffect, useMemo } from "react";
import type { User } from "@/lib/gateway-client";
import RoleSelect from "./RoleSelect";

const PAGE_SIZE = 10;

// Returns Tailwind pill-badge classes keyed by role. Superadmins get
// orange styling; all other roles render in neutral gray.
function roleBadgeClass(role: string) {
  if (role === "superadmin") {
    return "bg-orange-50 text-orange-700 border border-orange-200";
  }
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

// --- User Management Table ---
// Client component wrapping the responsive user table with in-memory
// search filtering and pagination (10 per page).
//
// Mobile (< sm): each row renders as a stacked card with inline labels.
// Desktop (sm+): standard aligned-column table with thead headers.
// Search filters case-insensitively on email or user id. Page resets to
// 1 whenever the search query changes.
//
// An empty users array renders a "No users found" message.
export default function UserTable({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on every search change so the user lands on the
  // first batch of matching rows.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <>
      {/* Search input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by email or user ID..."
        className="w-full rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
      />

      {/* Table / card list */}
      {paginatedUsers.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">
          {searchQuery ? "No users match that search." : "No users found."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white shadow-sm mt-4">
          <table className="min-w-full text-sm">
            <thead className="hidden sm:table-header-group bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  User ID
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Current Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="block mb-6 border border-stone-200 p-4 rounded-md bg-white sm:table-row sm:mb-0 sm:border-0 sm:p-0 sm:border-b sm:border-gray-100 sm:hover:bg-gray-50/50"
                >
                  {/* User ID — hidden on mobile, visible on desktop */}
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-center">
                    <span className="font-mono text-xs text-gray-900">
                      {user.id}
                    </span>
                  </td>

                  {/* Email — wraps on mobile */}
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 text-center">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-gray-500 mb-1">
                      Email
                    </span>
                    <span className="text-sm text-gray-900 break-all sm:break-normal">
                      {user.email}
                    </span>
                  </td>

                  {/* Current Role */}
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-center">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-gray-500 mb-1">
                      Role
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-center">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-gray-500 mb-1">
                      Actions
                    </span>
                    <RoleSelect userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 gap-4">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-stone-600">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}