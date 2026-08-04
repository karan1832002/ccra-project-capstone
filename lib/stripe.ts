import { loadStripe } from "@stripe/stripe-js";

// Loaded once and reused. Uses the PUBLISHABLE key (safe for the browser).
// Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local.
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);
