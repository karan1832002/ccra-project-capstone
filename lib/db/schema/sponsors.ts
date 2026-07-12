import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const sponsors = pgTable("sponsors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  logo: text("logo"),
  website: text("website"),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
