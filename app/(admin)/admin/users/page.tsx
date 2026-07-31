import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema/auth";
import type { User } from "@/lib/gateway-client";
import UserTable from "./UserTable";

export default async function AdminUsersPage() {
  // Restrict this route to superadmins only. The requireAdmin helper
  // redirects unauthenticated users to /sign-in and non-admins to /.
  await requireAdmin("superadmin");

  // Fetch all users directly from the frontend auth database. The
  // Drizzle schema uses camelCase column names; we map to the User
  // interface expected by downstream components.
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
    <div className="space-y-6 p-8 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user accounts and roles.
        </p>
      </div>

      <div>
        {fetchError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-800">
              Could not load users.
            </p>
            <p className="mt-1 text-sm text-red-600">
              {fetchError}
            </p>
          </div>
        ) : (
          <UserTable users={users!} />
        )}
      </div>
    </div>
  );
}