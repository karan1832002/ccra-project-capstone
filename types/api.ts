export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  purpose: "membership" | "event_entry" | "store_order";
  amountCents: number;
  currency: string;
  status: string;
  providerRef: string;
  createdAt: string;
}

// Add Event, Membership, Notification, Product, etc. the same way
// as the team builds those features out.