"use server";

import { submitContact, GatewayError } from "@/lib/gateway";
import type { ContactPayload } from "@/lib/gateway";

export type ContactFormState = {
  success: boolean;
  message: string;
};

/**
 * Server action that parses a contact-form FormData submission, validates
 * required fields, and forwards the payload to the admin-service via the
 * API gateway's /contact endpoint.
 */
export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() || undefined;
  const message = formData.get("message")?.toString().trim() ?? "";

  // Basic server-side validation
  if (!firstName || !lastName) {
    return { success: false, message: "First and last name are required." };
  }
  if (!email || !email.includes("@")) {
    return { success: false, message: "A valid email address is required." };
  }
  if (!message) {
    return { success: false, message: "Please enter a message." };
  }

  const payload: ContactPayload = { firstName, lastName, email, phone, message };

  try {
    await submitContact(payload);
    return { success: true, message: "Your message has been sent. We'll get back to you soon." };
  } catch (error) {
    if (error instanceof GatewayError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}