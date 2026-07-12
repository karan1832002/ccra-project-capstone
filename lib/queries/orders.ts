import { db } from "@/lib/db/client";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type NewOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export async function getOrdersByUser(userId: string) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: { items: { with: { product: true } } },
  });
}
export async function getOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: { with: { product: true } }, user: true },
  });
}
export async function createOrder(data: NewOrder, items: Omit<NewOrderItem, "orderId">[]) {
  const [order] = await db.insert(orders).values(data).returning();
  if (items.length > 0) {
    await db.insert(orderItems).values(items.map((item) => ({ ...item, orderId: order.id })));
  }
  return order;
}
export async function updateOrderStatus(id: string, status: string) {
  const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
  return updated ?? null;
}