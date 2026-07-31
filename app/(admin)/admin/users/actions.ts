"use server";

import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Server action called by the client-side RoleSelect dropdown.
// Updates the user's role directly in the frontend auth database
// using Drizzle, then revalidates the users page cache so the
// table reflects the change.
export async function changeUserRole(userId: string, role: string) {
  await db.update(user).set({ role }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
}