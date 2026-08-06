"use server";

// Each mutation revalidates both the admin edit path and the public-facing
// minutes page, so the published list stays in sync with admin changes.
// Errors are caught and returned as structured { success, message } objects
// instead of throwing, so the client component can display inline feedback.

import { revalidatePath } from "next/cache";
import { createMinute, updateMinute, deleteMinute } from "@/lib/gateway-client";
import { GatewayError } from "@/lib/gateway";
import type { MinuteEntryData } from "@/lib/gateway-client";

export async function createMinuteAction(
  data: MinuteEntryData,
): Promise<{ success: boolean; message: string }> {
  try {
    await createMinute(data);
    revalidatePath("/admin/minutes");
    revalidatePath("/about-us/minutes");
    return { success: true, message: "Minute created." };
  } catch (error) {
    if (error instanceof GatewayError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: error instanceof Error ? error.message : "Failed to create minute." };
  }
}

export async function updateMinuteAction(
  id: string,
  data: Partial<MinuteEntryData>,
): Promise<{ success: boolean; message: string }> {
  try {
    await updateMinute(id, data);
    revalidatePath("/admin/minutes");
    revalidatePath("/about-us/minutes");
    return { success: true, message: "Minute updated." };
  } catch (error) {
    if (error instanceof GatewayError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: error instanceof Error ? error.message : "Failed to update minute." };
  }
}

export async function deleteMinuteAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await deleteMinute(id);
    revalidatePath("/admin/minutes");
    revalidatePath("/about-us/minutes");
    return { success: true, message: "Minute deleted." };
  } catch (error) {
    if (error instanceof GatewayError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete minute." };
  }
}