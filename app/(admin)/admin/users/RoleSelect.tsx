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

// Inline role dropdown rendered inside the Users table Actions column.
// On change, fires a server action that updates the user's role
// directly in the frontend auth database via Drizzle. The action
// triggers revalidatePath so the server-rendered table picks up
// the change without a full page reload.
export default function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(currentRole);

  async function handleChange(newRole: string) {
    // Prevent a useless round-trip if the user reselects the same role.
    if (newRole === selectedRole) return;

    startTransition(async () => {
      // Optimistically update the local select so the UI feels instant.
      setSelectedRole(newRole);

      try {
        await changeUserRole(userId, newRole);
      } catch {
        // Revert to the server-confirmed role on failure so the dropdown
        // never shows a value that wasn't actually persisted.
        setSelectedRole(currentRole);
      }
    });
  }

  return (
    <select
      value={selectedRole}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {ROLE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}