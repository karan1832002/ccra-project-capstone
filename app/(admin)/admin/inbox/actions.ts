"use server";

import { updateContactStatus, updateRodeoApprovalStatus } from "@/lib/gateway-client";
import { GatewayError } from "@/lib/gateway";

export async function markContactStatus(
  id: string,
  status: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await updateContactStatus(id, status);
    return { success: true, message: `Contact submission marked as ${status}.` };
  } catch (error) {
    if (error instanceof GatewayError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update contact status.",
    };
  }
}

export async function markApprovalStatus(
  id: string,
  status: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await updateRodeoApprovalStatus(id, status);
    return { success: true, message: `Rodeo approval ${status}.` };
  } catch (error) {
    if (error instanceof GatewayError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update approval status.",
    };
  }
}
