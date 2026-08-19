"use client";

import { useEffect, useRef, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import {
  ArrowLeft,
  Lock,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { stripePromise } from "@/lib/stripe";
import { useCart } from "@/app/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { buttons, pageStructure, cards, inputField } from "@/lib/styles";

// Payment Form
function PayForm({
  paymentId,
  total,
  onPaid,
}: {
  paymentId: string;
  total: number;
  onPaid: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          typeof window !== "undefined"
            ? `${window.location.origin}/store/checkout`
            : "http://localhost:3000/store/checkout",
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        const res = await fetch(
          `/api/gateway/api/payments/${paymentId}/confirm`,
          {
            method: "POST",
          }
        );

        const json = await res.json();

        if (res.ok && json.success) {
          onPaid();
        } else {
          setError(
            json?.error?.message ??
              "Payment succeeded in Stripe but couldn’t be verified by the server."
          );
          setProcessing(false);
        }
      } catch {
        setError("Network error while confirming the payment. Please try again.");
        setProcessing(false);
      }
    } else {
      setError("Payment could not be completed.");
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-7">
      {/* Shipping */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-heading-text">
          Shipping details
        </h2>

        <div className="space-y-3">
          <div>
            <label className={inputField.label}>
              Full name
            </label>
            <input
              type="text"
              className={`${inputField.input} ${inputField.inputHeight}`}
              placeholder="Jane Rider"
              required
            />
          </div>

          <div>
            <label className={inputField.label}>
              Address
            </label>
            <input
              type="text"
              className={`${inputField.input} ${inputField.inputHeight}`}
              placeholder="123 Rodeo Rd, Calgary, AB"
              required
            />
          </div>
        </div>
      </section>

      {/* Payment */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-heading-text">
          Payment
          <span className="flex items-center gap-1 text-[11px] font-medium normal-case tracking-normal text-green-600">
            <Lock className="h-3 w-3" /> Secured by Stripe
          </span>
        </h2>

        <div className="rounded-lg border border-border p-3.5 bg-surface">
          <PaymentElement />
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-100 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`${buttons.primaryButton} w-full`}
      >
        {processing ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Pay ${total.toFixed(2)}
          </>
        )}
      </button>

      {/* <p className="text-center text-xs text-muted-foreground">
        Test card <span className="font-mono">4242 4242 4242 4242</span> · any future date · any CVC
      </p> */}
    </form>
  );
}

// Checkout Page
export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { data: session, isPending: sessionLoading } = useSession();

  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "paid" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const startedRef = useRef(false);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const amountCents = Math.round(total * 100);

  useEffect(() => {
    if (cartItems.length === 0 || amountCents <= 0 || sessionLoading || clientSecret) return;
    if (startedRef.current) return;

    startedRef.current = true;

    const userId = session?.user?.id ?? "guest";

    async function startCheckout() {
      try {
        const validOrderItems = cartItems
          .filter((i) => i.id)
          .map((i) => ({ productId: i.id!, quantity: i.qty }));

        let paymentData: { clientSecret: string; id: string } | null = null;

        if (validOrderItems.length === cartItems.length) {
          const res = await fetch("/api/gateway/api/store/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, items: validOrderItems }),
          });

          const json = await res.json();

          if (res.ok && json?.data?.payment?.clientSecret) {
            paymentData = {
              clientSecret: json.data.payment.clientSecret,
              id: json.data.payment.id,
            };
          }
        }

        if (!paymentData) {
          const res = await fetch("/api/gateway/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              purpose: "store_order",
              amountCents,
              currency: "CAD",
            }),
          });

          const json = await res.json();

          if (json?.data?.clientSecret) {
            paymentData = { clientSecret: json.data.clientSecret, id: json.data.id };
          }
        }

        if (paymentData) {
          setClientSecret(paymentData.clientSecret);
          setPaymentId(paymentData.id);
          setState("ready");
        } else {
          setErrorMsg("Payments aren’t configured on the server yet.");
          setState("error");
        }
      } catch {
        setErrorMsg("Couldn’t start checkout. Please try again.");
        setState("error");
      }
    }

    startCheckout();
  }, [amountCents, cartItems.length, session, sessionLoading, clientSecret]);

  function handlePaid() {
    clearCart();
    setState("paid");
  }

  // Empty cart
  if (cartItems.length === 0 && state !== "paid") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-accent-text" />
        <h1 className="mb-2 text-2xl font-bold text-heading-text">Your cart is empty</h1>
        <p className="mb-6 text-body-text">Add some CCRA gear before checking out.</p>

        <a
          href="/store"
          className={buttons.primaryButton}
        >
          Go to Store
        </a>
      </div>
    );
  }

  // Paid
  if (state === "paid") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
        <h1 className="mb-2 text-3xl font-bold text-heading-text">Payment successful</h1>
        <p className="mb-8 text-body-text">
          Thanks for supporting CCRA — your order is confirmed.
        </p>

        <a
          href="/store"
          className={buttons.primaryButton}
        >
          Continue shopping
        </a>
      </div>
    );
  }

  // Main checkout
  return (
    <div className={pageStructure.pageWrapper}>
      <div className={pageStructure.contentContainer}>
        <a
          href="/cart"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-body-text transition hover:text-accent-text"
        >
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </a>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-heading-text">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className={cards.layout}>
            {state === "loading" && (
              <div className="flex flex-col items-center gap-3 py-16 text-body-text">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-primary" />
                Preparing secure checkout…
              </div>
            )}

            {state === "error" && (
              <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-8 text-center text-red-700 dark:bg-red-900/40 dark:text-red-300">
                {errorMsg}
              </div>
            )}

            {state === "ready" && clientSecret && paymentId && (
              <Elements key={paymentId} stripe={stripePromise} options={{ clientSecret }}>
                <PayForm paymentId={paymentId} total={total} onPaid={handlePaid} />
              </Elements>
            )}
          </div>

          {/* RIGHT */}
          <aside className="h-fit lg:sticky lg:top-10">
            <div className={cards.layout}>
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-heading-text">
                <ShoppingBag className="h-4 w-4 text-accent-text" />
                Order summary
                <span className="ml-auto rounded-full bg-highlight px-2 py-0.5 text-xs font-medium text-accent-text">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </h2>

              <ul className="space-y-3">
                {cartItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      )}
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-highlight px-1 text-[11px] font-semibold text-accent-text">
                        {item.qty}
                      </span>
                    </div>

                    <span className="flex-1 truncate text-sm text-body-text">
                      {item.title}
                    </span>

                    <span className="text-sm font-medium text-body-text">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-body-text">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-body-text">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-heading-text">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-caption-text">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure SSL checkout · Powered by Stripe
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
