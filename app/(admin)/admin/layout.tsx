import "server-only";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  ShoppingCart,
  Mail,
  Image,
  Star,
  Trophy,
  Inbox,
  FileText,
} from "lucide-react";

// --- Sidebar Route Definitions ---
// Navigation items rendered in the admin sidebar. Each entry defines a
// label, target route, and icon. Items tagged superadminOnly are only
// visible when the authenticated user holds the superadmin role.
const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox },
  { label: "Minutes", href: "/admin/minutes", icon: FileText },
  { label: "Users", href: "/admin/users", icon: Users, superadminOnly: true },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Results", href: "/admin/results", icon: Trophy },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Newsletters", href: "/admin/newsletters", icon: Mail },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Sponsors", href: "/admin/sponsors", icon: Star },
];

// --- Admin Layout Shell ---
// Server component that wraps every /admin route. Calls requireAdmin()
// to gate all admin pages behind authentication and at least an "admin"
// role. The sidebar filters navigation items by role, hiding superadmin-
// only routes from regular admins. Children render in the main content
// area beside the sidebar.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = await requireAdmin();

  const visibleNavItems = navItems.filter(
    (item) => !item.superadminOnly || role === "superadmin"
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* --- Sidebar (desktop only) --- */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <Link href="/admin" className="text-lg font-semibold text-gray-900">
            CCRA Admin
          </Link>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{role}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}