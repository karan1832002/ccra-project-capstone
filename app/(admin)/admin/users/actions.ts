"use server";

import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Update User Role Server Action ---
// Called by the client-side RoleSelect dropdown in the Users table.
// This action is only reachable by superadmins — the parent page at
// /admin/users enforces requireAdmin("superadmin") before rendering
// the table that contains the RoleSelect component.
//
// Writes directly to the frontend auth database via Drizzle's update
// builder, matching on the user's primary key. After the write, calls
// revalidatePath to purge the Next.js cache for /admin/users so the
// server-rendered UserTable reflects the new role without a full reload.
export async function changeUserRole(userId: string, role: string) {
  await db.update(user).set({ role }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
}