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
} from "lucide-react";

// --- Sidebar Route Definitions ---
// Navigation items rendered in the admin sidebar. Each entry defines a
// label, target route, and icon. Items tagged superadminOnly are only
// visible when the authenticated user holds the superadmin role.
const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox },
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
    <div className="min-h-screen bg-background flex">
      {/* --- Sidebar (desktop only) --- */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="px-6 py-5 border-b border-border">
          <Link href="/admin" className="text-lg font-semibold text-heading-text">
            CCRA Admin
          </Link>
          <p className="text-xs text-caption-text mt-0.5 capitalize">{role}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-body-text transition hover:bg-accent hover:text-accent-text"
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