import { User } from "@/lib/gateway-client";
import RoleSelect from "./RoleSelect";

// Helper that returns pill-badge classes for a given role string.
function roleBadgeClass(role: string) {
  if (role === "superadmin") {
    return "bg-orange-50 text-orange-700 border border-orange-200";
  }
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

// Server component that renders a list of users in a styled table.
// Each row shows the user's ID, email, current role, and an inline
// role-change dropdown (RoleSelect) in the Actions column.
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