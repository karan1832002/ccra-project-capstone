"use client";

import { useState, useTransition } from "react";
import { changeUserRole } from "./actions";

const ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
  { label: "Superadmin", value: "superadmin" },
] as const;

interface RoleSelectProps {
  userId: string;
  currentRole: string;
}

// --- Role Select Dropdown ---
// Client component rendered inside each row of the User Management Table.
// Receives the user ID and current role as props from the parent UserTable
// server component. On selection change, fires the changeUserRole server
// action which persists the update directly to the auth database via Drizzle.
// The parent page at /admin/users gates access with requireAdmin("superadmin"),
// so this component is only reachable by superadmins.
//
// Uses an optimistic-update pattern: the local select value updates
// immediately via setSelectedRole, then on server-action failure it
// reverts to the original currentRole prop. This prevents the dropdown
// from displaying a value that was never committed to the database.
// The isPending flag from useTransition disables the select during the
// async mutation to prevent double-submissions.
export default function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(currentRole);

  async function handleChange(newRole: string) {
    if (newRole === selectedRole) return;

    startTransition(async () => {
      setSelectedRole(newRole);

      try {
        await changeUserRole(userId, newRole);
      } catch {
        setSelectedRole(currentRole);
      }
    });
  }

  return (
    <select
      value={selectedRole}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-heading-text min-h-[44px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {ROLE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}