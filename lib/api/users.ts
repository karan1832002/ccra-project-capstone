import { api } from "./client";
import { User } from "@/types/api";

export function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  province?: string;
}) {
  return api.post<User>("/api/users/register", data);
}

export function getUser(id: string) {
  return api.get<User>(`/api/users/${id}`);
}

export function updateUser(id: string, data: Partial<User>) {
  return api.patch<User>(`/api/users/${id}`, data);
}