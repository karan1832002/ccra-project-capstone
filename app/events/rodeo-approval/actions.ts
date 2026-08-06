"use server";

import { submitRodeoApproval, GatewayError } from "@/lib/gateway";
import type { RodeoApprovalPayload } from "@/lib/gateway";

export type RodeoApprovalFormState = {
  success: boolean;
  message: string;
};

/**
 * Server action that parses a rodeo-approval FormData submission, validates
 * required fields, and forwards the full payload to the admin-service via the
 * API gateway's /rodeo-approvals endpoint.
 *
 * Every named input in the form is extracted and sent so that the database
 * row is fully populated rather than leaving optional columns as null.
 */
export async function submitRodeoApprovalAction(
  _prevState: RodeoApprovalFormState,
  formData: FormData,
): Promise<RodeoApprovalFormState> {
  const rodeoName = formData.get("rodeoName")?.toString().trim() ?? "";
  const committeeName = formData.get("committeeName")?.toString().trim() ?? "";
  const primaryContact = formData.get("primaryContact")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() || undefined;
  const message = formData.get("message")?.toString().trim() || undefined;

  // Section 1: Basic Rodeo Info
  const rodeoType = formData.get("rodeoType")?.toString().trim() || undefined;
  const location = formData.get("location")?.toString().trim() || undefined;
  const arenaType = formData.get("arenaType")?.toString().trim() || undefined;

  // Section 2: Added Money — collect all addedMoney_* fields into a record
  const addedMoney: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("addedMoney_") && typeof value === "string" && value.trim()) {
      addedMoney[key] = value.trim();
    }
  }

  // Section 3: Performance & Personnel
  const scheduleDetails = formData.get("scheduleDetails")?.toString().trim() || undefined;
  const orderOfEvents = formData.get("orderOfEvents")?.toString().trim() || undefined;
  const stockContractor = formData.get("stockContractor")?.toString().trim() || undefined;
  const judges = formData.get("judges")?.toString().trim() || undefined;

  // Section 4: Facility Amenities
  const electrical = formData.get("electrical")?.toString().trim() || undefined;
  const stalls = formData.get("stalls")?.toString().trim() || undefined;
  const selfPenning = formData.get("selfPenning")?.toString().trim() || undefined;
  const stallContact = formData.get("stallContact")?.toString().trim() || undefined;

  // Section 5: Committee & Legal Info
  const mailingAddress = formData.get("mailingAddress")?.toString().trim() || undefined;
  const directions = formData.get("directions")?.toString().trim() || undefined;

  // Section 6: Medical & Fees
  const medicalProvider = formData.get("medicalProvider")?.toString().trim() || undefined;
  const associationFees = formData.get("associationFees")?.toString().trim() || undefined;

  // Section 7: Agreement & Payment
  const signature = formData.get("signature")?.toString().trim() || undefined;
  const dateSigned = formData.get("dateSigned")?.toString().trim() || undefined;
  const payment = formData.get("payment")?.toString().trim() || undefined;

  // Validation — only the core required fields
  if (!rodeoName) {
    return { success: false, message: "Rodeo name is required." };
  }
  if (!committeeName) {
    return { success: false, message: "Committee name is required." };
  }
  if (!primaryContact) {
    return { success: false, message: "Primary contact person is required." };
  }
  if (!email || !email.includes("@")) {
    return { success: false, message: "A valid email address is required." };
  }

  const payload: RodeoApprovalPayload = {
    rodeoName,
    committeeName,
    primaryContact,
    email,
    phone,
    message,
    rodeoType,
    location,
    arenaType,
    scheduleDetails,
    orderOfEvents,
    stockContractor,
    judges,
    electrical,
    stalls,
    selfPenning,
    stallContact,
    mailingAddress,
    directions,
    medicalProvider,
    associationFees,
    signature,
    dateSigned,
    payment,
    addedMoney: Object.keys(addedMoney).length > 0 ? addedMoney : undefined,
  };

  try {
    await submitRodeoApproval(payload);
    return {
      success: true,
      message:
        "Your rodeo approval request has been submitted. The CCRA board will review it shortly.",
    };
  } catch (error) {
    if (error instanceof GatewayError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}