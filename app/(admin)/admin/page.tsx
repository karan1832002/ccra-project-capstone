import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema/events";
import { orders } from "@/lib/db/schema/orders";
import { user } from "@/lib/db/schema/auth";
import { sponsors } from "@/lib/db/schema/sponsors";
import { count, eq } from "drizzle-orm";
import { Calendar, ShoppingCart, Users, Star } from "lucide-react";

export default async function AdminDashboardPage() {
  let totalRodeos = 0;
  let pendingOrders = 0;
  let totalUsers = 0;
  let activeSponsors = 0;
  let fetchError: string | null = null;

  // Fetch dashboard metrics from the local database. A caught error
  // renders an error banner instead of crashing the entire page so
  // the admin layout and sidebar remain usable.
  try {
    [totalRodeos, pendingOrders, totalUsers, activeSponsors] =
      await Promise.all([
        db
          .select({ value: count() })
          .from(events)
          .then((r) => r[0]?.value ?? 0),
        db
          .select({ value: count() })
          .from(orders)
          .where(eq(orders.status, "pending"))
          .then((r) => r[0]?.value ?? 0),
        db
          .select({ value: count() })
          .from(user)
          .then((r) => r[0]?.value ?? 0),
        db
          .select({ value: count() })
          .from(sponsors)
          .where(eq(sponsors.visible, true))
          .then((r) => r[0]?.value ?? 0),
      ]);
  } catch (error: unknown) {
    fetchError =
      error instanceof Error ? error.message : "Failed to load dashboard data.";
  }

  const stats = [
    { label: "Total Rodeos", value: totalRodeos, icon: Calendar },
    { label: "Orders Pending", value: pendingOrders, icon: ShoppingCart },
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Active Sponsors", value: activeSponsors, icon: Star },
  ];

  return (
    <div className="space-y-6 p-8 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Key metrics across the CCRA platform.
        </p>
      </div>

      {fetchError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-800">
            Could not load dashboard metrics.
          </p>
          <p className="mt-1 text-sm text-red-600">
            {fetchError}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-md border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}