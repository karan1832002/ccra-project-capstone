"use server";

import { revalidatePath } from "next/cache";
import { callGateway } from "@/lib/gateway-client";

// --- Order Actions ---
// Orders live in the product-service, so everything goes through callGateway,
// which attaches the verified session role that requireRole("admin") checks.

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  productName: string;
  productImage: string | null;
};

export type AdminOrder = {
  id: string;
  userId: string;
  status: string; // pending | paid | shipped | delivered | cancelled
  totalCents: number;
  paymentId: string | null;
  createdAt: string;
  items: OrderItem[];
};

// NOTE: a "use server" file may only export async functions, so the
// ORDER_STATUSES list lives in OrderManager.tsx rather than here.

// Every order, newest first, with line items and product names attached.
export async function getAdminOrders(): Promise<AdminOrder[]> {
  return callGateway<AdminOrder[]>("/api/store/orders");
}

// How many paid orders are still waiting to be shipped — the number the admin
// actually has to act on. Used for the sidebar badge. Never throws: if the
// product-service is unreachable this returns 0 rather than breaking the whole
// admin shell, since the layout renders on every admin page.
export async function getOrdersAwaitingShipmentCount(): Promise<number> {
  try {
    const orders = await callGateway<AdminOrder[]>("/api/store/orders");
    return orders.filter((o) => o.status === "paid").length;
  } catch {
    return 0;
  }
}

// Moves an order along the fulfilment pipeline (e.g. paid -> shipped).
export async function updateOrderStatus(id: string, status: string) {
  const result = await callGateway<AdminOrder>(`/api/store/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  revalidatePath("/admin/orders");
  return result;
}
