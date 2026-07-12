import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type NewProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export async function getAllProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt));
}
export async function getProductsByCategory(category: string) {
  return db.select().from(products).where(eq(products.category, category));
}
export async function getProductById(id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product ?? null;
}
export async function createProduct(data: NewProduct) {
  const [created] = await db.insert(products).values(data).returning();
  return created;
}
export async function updateProduct(id: string, data: Partial<NewProduct>) {
  const [updated] = await db.update(products).set(data).where(eq(products.id, id)).returning();
  return updated ?? null;
}
export async function deleteProduct(id: string) {
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
  return deleted ?? null;
}