import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema/events";
import { orders } from "@/lib/db/schema/orders";
import { user } from "@/lib/db/schema/auth";
import { sponsors } from "@/lib/db/schema/sponsors";
import { count, eq, sql } from "drizzle-orm";
import { TrendingUp, Users, Calendar, ShoppingCart, Star } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalRodeos, pendingOrders, totalUsers, activeSponsors] = await Promise.all([
    db.select({ value: count() }).from(events).then((r) => r[0]?.value ?? 0),
    db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, "pending"))
      .then((r) => r[0]?.value ?? 0),
    db.select({ value: count() }).from(user).then((r) => r[0]?.value ?? 0),
    db
      .select({ value: count() })
      .from(sponsors)
      .where(eq(sponsors.visible, true))
      .then((r) => r[0]?.value ?? 0),
  ]);

  const stats = [
    { label: "Total Rodeos", value: totalRodeos, icon: Calendar },
    { label: "Orders Pending", value: pendingOrders, icon: ShoppingCart },
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Active Sponsors", value: activeSponsors, icon: Star },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-stone-950 dark:text-stone-100">
        Dashboard Overview
      </h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Key metrics across the CCRA platform.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-md border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{stat.label}</p>
                  <p className="text-xl font-semibold text-stone-950 dark:text-stone-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}