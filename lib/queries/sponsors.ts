import { db } from "@/lib/db/client";
import { sponsors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type NewSponsor = typeof sponsors.$inferInsert;
export type Sponsor = typeof sponsors.$inferSelect;

export async function getVisibleSponsors() {
  return db.select().from(sponsors).where(eq(sponsors.visible, true));
}
export async function getAllSponsors() {
  return db.select().from(sponsors);
}
export async function getSponsorById(id: string) {
  const [sponsor] = await db.select().from(sponsors).where(eq(sponsors.id, id));
  return sponsor ?? null;
}
export async function createSponsor(data: NewSponsor) {
  const [created] = await db.insert(sponsors).values(data).returning();
  return created;
}
export async function updateSponsor(id: string, data: Partial<NewSponsor>) {
  const [updated] = await db.update(sponsors).set(data).where(eq(sponsors.id, id)).returning();
  return updated ?? null;
}
export async function deleteSponsor(id: string) {
  const [deleted] = await db.delete(sponsors).where(eq(sponsors.id, id)).returning();
  return deleted ?? null;
}