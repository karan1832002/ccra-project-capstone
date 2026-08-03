import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema/auth";
import type { User } from "@/lib/gateway-client";
import UserTable from "./UserTable";

// --- User Management Page ---
// Server component restricted to superadmins. Fetches all user records
// from the auth database and passes the mapped User[] array to the
// UserTable client component. Search, pagination, and role mutation
// are handled client-side within UserTable and RoleSelect.
export default async function AdminUsersPage() {
  await requireAdmin("superadmin");

  let users: User[] | null = null;
  let fetchError: string | null = null;

  try {
    const rows = await db
      .select({
        id: user.id,
        email: user.email,
        role: user.role,
      })
      .from(user);

    users = rows.map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role ?? "member",
    }));
  } catch (error: unknown) {
    fetchError =
      error instanceof Error ? error.message : "Failed to load users.";
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and roles.
          </p>
        </div>
      </div>

      <div>
        {fetchError ? (
          /* --- Error Banner --- */
          <div className="rounded-md border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-800">
              Could not load users.
            </p>
            <p className="mt-1 text-sm text-red-600">{fetchError}</p>
          </div>
        ) : (
          /* --- User Management Table (client-side search + pagination) --- */
          <div className="w-full overflow-x-auto border-t border-stone-200 mt-4">
            <UserTable users={users!} />
          </div>
        )}
      </div>
    </div>
  );
}