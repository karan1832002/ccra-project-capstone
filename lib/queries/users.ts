import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type User = typeof user.$inferSelect;

export async function getUserById(id: string) {
  const [found] = await db.select().from(user).where(eq(user.id, id));
  return found ?? null;
}
export async function getUserByEmail(email: string) {
  const [found] = await db.select().from(user).where(eq(user.email, email));
  return found ?? null;
}
export async function listUsers() {
  return db.select().from(user);
}
export async function updateUserRole(id: string, role: string) {
  const [updated] = await db.update(user).set({ role }).where(eq(user.id, id)).returning();
  return updated ?? null;
}