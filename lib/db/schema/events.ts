import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  rawDate: text("raw_date"),
  rawTime: text("raw_time"),
  location: text("location").notNull(),
  image: text("image"),
  description: text("description"),
  category: text("category"),
  entriesOpen: boolean("entries_open").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
