import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type NewEvent = typeof events.$inferInsert;
export type Event = typeof events.$inferSelect;

export async function getAllEvents() {
  return db.select().from(events).orderBy(desc(events.createdAt));
}
export async function getUpcomingEvents() {
  return db.select().from(events).where(eq(events.entriesOpen, true));
}
export async function getEventById(id: string) {
  const [event] = await db.select().from(events).where(eq(events.id, id));
  return event ?? null;
}
export async function createEvent(data: NewEvent) {
  const [created] = await db.insert(events).values(data).returning();
  return created;
}
export async function updateEvent(id: string, data: Partial<NewEvent>) {
  const [updated] = await db.update(events).set(data).where(eq(events.id, id)).returning();
  return updated ?? null;
}
export async function deleteEvent(id: string) {
  const [deleted] = await db.delete(events).where(eq(events.id, id)).returning();
  return deleted ?? null;
}