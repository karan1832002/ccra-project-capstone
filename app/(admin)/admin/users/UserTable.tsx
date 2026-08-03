import { User } from "@/lib/gateway-client";
import RoleSelect from "./RoleSelect";

// Returns Tailwind pill-badge classes keyed by role. Superadmins get
// orange styling; all other roles render in neutral gray.
function roleBadgeClass(role: string) {
  if (role === "superadmin") {
    return "bg-orange-50 text-orange-700 border border-orange-200";
  }
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

// --- User Management Table ---
// Server component that receives a User[] array from the parent
// AdminUsersPage and renders it as a styled HTML table. Each row
// displays the user ID (monospaced), email, a role pill badge, and an
// inline RoleSelect dropdown in the Actions column. The RoleSelect is
// the only client-side boundary in this tree — the table itself remains
// a server component.
//
// An empty users array renders a "No users found" message instead of
// an empty table so the admin gets clear feedback.
export default function UserTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No users found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
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
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 bg-white transition-colors hover:bg-gray-50/50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                <span className="font-mono text-xs text-gray-900">
                  {user.id}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(user.role)}`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                <RoleSelect userId={user.id} currentRole={user.role} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}