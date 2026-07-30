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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users, superadminOnly: true },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Newsletters", href: "/admin/newsletters", icon: Mail },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Sponsors", href: "/admin/sponsors", icon: Star },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireAdmin();

  const visibleNavItems = navItems.filter(
    (item) => !item.superadminOnly || role === "superadmin"
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900 flex flex-col">
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700">
          <Link href="/admin" className="text-lg font-semibold text-stone-950 dark:text-stone-100">
            CCRA Admin
          </Link>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 capitalize">{role}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-orange-50 hover:text-orange-600 dark:text-stone-300 dark:hover:bg-orange-950/20 dark:hover:text-orange-400"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}