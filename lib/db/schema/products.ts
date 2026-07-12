import { pgTable, text, timestamp, numeric, uuid } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category"),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});
