import { api } from "./client";
import { Payment } from "@/types/api";

export function createPayment(data: {
  userId: string;
  purpose: "membership" | "event_entry" | "store_order";
  referenceId?: string;
  amountCents: number;
  currency: string;
}) {
  return api.post<Payment>("/api/payments", data);
}

export function confirmPayment(id: string) {
  return api.post<Payment>(`/api/payments/${id}/confirm`, {});
}

export function getUserPayments(userId: string) {
  return api.get<Payment[]>(`/api/payments/user/${userId}`);
}