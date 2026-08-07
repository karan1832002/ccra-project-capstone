"use client";

import { Fragment, useState, useTransition } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageX,
  ShoppingCart,
} from "lucide-react";
import { updateOrderStatus, type AdminOrder } from "./actions";

// The full lifecycle an order can move through. Defined here (not in actions.ts)
// because a "use server" file can only export async functions.
const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

// Colour per lifecycle stage so the table can be scanned at a glance.
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-stone-800 text-white",
  cancelled: "bg-red-100 text-red-700",
};

// The obvious next step for an order, surfaced as a one-click button so the
// common path doesn't need the dropdown. Statuses not listed here (pending,
// delivered, cancelled) have no automatic next action.
const NEXT_STEP: Record<string, { label: string; next: string }> = {
  paid: { label: "Mark shipped", next: "shipped" },
  shipped: { label: "Mark delivered", next: "delivered" },
};

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

// Rows per page. Pagination is client-side: the admin list is small enough to
// fetch in one go, this just keeps the table from becoming an endless scroll.
const PAGE_SIZE = 20;

export default function OrderManager({ orders }: { orders: AdminOrder[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // Open on the work queue (paid = awaiting shipment) so the admin lands on
  // what needs doing — but fall back to "all" when there's nothing waiting,
  // rather than showing an empty table.
  const [filter, setFilter] = useState<string>(() =>
    orders.some((o) => o.status === "paid") ? "paid" : "all",
  );
  const [, startTransition] = useTransition();

  function handleStatusChange(id: string, status: string) {
    setBusyId(id);
    startTransition(async () => {
      try {
        await updateOrderStatus(id, status);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Could not update the order.");
      } finally {
        setBusyId(null);
      }
    });
  }

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Clamp the page so it stays valid when the list shrinks (filter change, or an
  // order moving out of the current status).
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paged = visible.slice(start, start + PAGE_SIZE);

  // Switching filters should always land on the first page of the new list.
  function changeFilter(next: string) {
    setFilter(next);
    setPage(1);
    setExpanded(null);
  }

  // Revenue only counts orders that were actually paid for.
  const revenue = orders
    .filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.totalCents, 0);
  const awaitingFulfilment = orders.filter((o) => o.status === "paid").length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-950">Orders</h1>
        <p className="mt-1 text-sm text-stone-600">Manage customer orders and fulfilment.</p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-stone-600">Total orders</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-stone-600">Revenue (paid)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">{money(revenue)}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-stone-600">Awaiting shipment</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-orange-600">{awaitingFulfilment}</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => changeFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === s
                ? "bg-stone-900 text-white"
                : "border border-stone-300 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {s}
            {s !== "all" && (
              <span className="ml-1.5 text-[11px] opacity-70">
                {orders.filter((o) => o.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-16 text-center">
          <PackageX className="mx-auto mb-3 h-10 w-10 text-stone-300" />
          <p className="text-stone-600">
            {orders.length === 0 ? "No orders yet." : `No ${filter} orders.`}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="w-8 px-4 py-3" />
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 text-right font-medium">Items</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paged.map((o) => {
                  const isOpen = expanded === o.id;
                  return (
                    <Fragment key={o.id}>
                      <tr className="hover:bg-stone-50/60">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpanded(isOpen ? null : o.id)}
                            className="rounded p-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-700"
                            title={isOpen ? "Hide items" : "Show items"}
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-stone-600">
                            {o.id.slice(0, 8)}
                          </span>
                          {!o.paymentId && (
                            <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                              no payment
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-stone-600">
                          {new Date(o.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-stone-600">
                            {o.userId.slice(0, 12)}…
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-stone-700">
                          {o.items.reduce((n, i) => n + i.quantity, 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums text-stone-900">
                          {money(o.totalCents)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                STATUS_STYLES[o.status] ?? "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {o.status}
                            </span>

                            {/* One-click primary action for the common path */}
                            {NEXT_STEP[o.status] && (
                              <button
                                onClick={() => handleStatusChange(o.id, NEXT_STEP[o.status].next)}
                                disabled={busyId === o.id}
                                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-orange-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                              >
                                {busyId === o.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                                {NEXT_STEP[o.status].label}
                              </button>
                            )}

                            {/* Dropdown stays for exceptions (cancel, correcting a mistake) */}
                            <select
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                              disabled={busyId === o.id}
                              className="h-7 rounded-md border border-stone-300 bg-white px-1.5 text-xs text-stone-600 outline-none transition focus:border-orange-500 disabled:opacity-50"
                              title="Change status manually"
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>

                            {busyId === o.id && !NEXT_STEP[o.status] && (
                              <Loader2 className="h-4 w-4 animate-spin text-stone-600" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Line items */}
                      {isOpen && (
                        <tr className="bg-stone-50/80">
                          <td />
                          <td colSpan={6} className="px-4 py-3">
                            {o.items.length === 0 ? (
                              <p className="text-xs text-stone-600">
                                No line items recorded for this order.
                              </p>
                            ) : (
                              <ul className="space-y-2">
                                {o.items.map((item) => (
                                  <li key={item.id} className="flex items-center gap-3">
                                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded border border-stone-200 bg-white">
                                      {item.productImage && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={item.productImage}
                                          alt={item.productName}
                                          className="h-full w-full object-cover"
                                        />
                                      )}
                                    </div>
                                    <span className="flex-1 text-stone-700">
                                      {item.productName}
                                    </span>
                                    <span className="text-stone-600">×{item.quantity}</span>
                                    <span className="w-20 text-right tabular-nums text-stone-700">
                                      {money(item.unitPriceCents * item.quantity)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {o.paymentId && (
                              <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-600">
                                <ShoppingCart className="h-3 w-3" />
                                Payment ref{" "}
                                <span className="font-mono">{o.paymentId}</span>
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination — only shown once the list outgrows a single page */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-xs text-stone-600">
                Showing <span className="font-medium text-stone-700">{start + 1}</span>–
                <span className="font-medium text-stone-700">
                  {Math.min(start + PAGE_SIZE, visible.length)}
                </span>{" "}
                of <span className="font-medium text-stone-700">{visible.length}</span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setPage(safePage - 1);
                    setExpanded(null);
                  }}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>

                <span className="px-3 text-xs text-stone-600">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  onClick={() => {
                    setPage(safePage + 1);
                    setExpanded(null);
                  }}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
