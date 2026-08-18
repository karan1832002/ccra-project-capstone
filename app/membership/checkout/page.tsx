"use client";
 
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { pageStructure, buttons } from "@/lib/styles";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Lock, BadgeCheck, CheckCircle2, ShieldCheck } from "lucide-react";
import { stripePromise } from "@/lib/stripe";
import { useSession } from "@/lib/auth-client";
import { membershipExpiryDate } from "@/lib/season";
 
// Membership fee (test): $183.75. Kept in cents to match the payment-service.
const MEMBERSHIP_AMOUNT_CENTS = 18375;
 
// -------------------------------------------------------------------------
// Payment form — lives inside <Elements> so it can use the mounted card input.
// On success it confirms with our backend, which (via webhook too) activates
// the membership.
// -------------------------------------------------------------------------
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
            ? `${window.location.origin}/membership/checkout`
            : "http://localhost:3000/membership/checkout",
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
        const res = await fetch(`/api/gateway/api/payments/${paymentId}/confirm`, {
          method: "POST",
        });
        const json = await res.json();
        if (res.ok && json.success) {
          onPaid();
        } else {
          setError(
            json?.error?.message ??
              "Payment succeeded in Stripe but couldn’t be verified by the server.",
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
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-body">
          Payment
          <span className="flex items-center gap-1 text-[11px] font-medium normal-case tracking-normal text-green-700">
            <Lock className="h-3 w-3" /> Secured by Stripe
          </span>
        </h2>
        <div className="rounded-lg border border-border p-3.5">
          <PaymentElement />
        </div>
      </section>
 
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
 
      <button
        type="submit"
        disabled={!stripe || processing}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-primary-text shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
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
 
      <p className="text-center text-xs text-body-text">
        Test card <span className="font-mono">4242 4242 4242 4242</span> · any future date · any CVC
      </p>
    </form>
  );
}
 
// -------------------------------------------------------------------------
// Checkout: creates a "membership" PaymentIntent (referenceId = membership id)
// so a cleared payment activates that membership.
// -------------------------------------------------------------------------
function MembershipCheckout() {
  const params = useSearchParams();
  const membershipId = params.get("mid");
  const { data: session, isPending: sessionLoading } = useSession();
 
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "paid" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const startedRef = useRef(false);
  // Receipt details, captured at the moment payment succeeds.
  const [paidAt, setPaidAt] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
 
  const total = MEMBERSHIP_AMOUNT_CENTS / 100;
 
  useEffect(() => {
    if (sessionLoading || clientSecret) return;
    if (!membershipId) return;
    if (startedRef.current) return; // guard against StrictMode double-run
    startedRef.current = true;
 
    const userId = session?.user?.id ?? "guest";
 
    async function startCheckout() {
      if (!membershipId) {
        setErrorMsg("Missing membership reference. Please start from the membership page.");
        setState("error");
        return;
      }
      try {
        const res = await fetch("/api/gateway/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            purpose: "membership",
            referenceId: membershipId,
            amountCents: MEMBERSHIP_AMOUNT_CENTS,
            currency: "CAD",
          }),
        });
        const json = await res.json();
        if (json?.data?.clientSecret) {
          setClientSecret(json.data.clientSecret);
          setPaymentId(json.data.id);
          setState("ready");
        } else {
          setErrorMsg("Payments aren’t configured on the server yet (missing Stripe key).");
          setState("error");
        }
      } catch {
        setErrorMsg("Couldn’t start checkout. Please try again.");
        setState("error");
      }
    }
 
    startCheckout();
  }, [membershipId, session, sessionLoading, clientSecret]);
 
  // Record the receipt details, then pull the real expiry date the backend set.
  async function handlePaid() {
    setPaidAt(new Date());
    setState("paid");
    try {
      const userId = session?.user?.id;
      if (!userId) return;
      const res = await fetch(`/api/gateway/api/memberships/status/${userId}`);
      const json = await res.json();
      if (json?.data?.expiryDate) setExpiryDate(json.data.expiryDate);
    } catch {
      // Non-fatal: the receipt just omits the expiry line.
    }
  }
 
  if (state === "paid") {
    return (
      <div className="mx-auto max-w-lg px-4 py-14">
        <div className="mb-6 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-success" />
          <h1 className="text-2xl font-bold text-heading-text">Payment successful</h1>
          <p className="mt-1 text-sm text-body-text">
            Your CCRA membership is now active. Keep this receipt for your records.
          </p>
        </div>
 
        {/* Receipt */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-accent px-6 py-4">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <span className="font-semibold text-heading-text">CCRA Receipt</span>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
              PAID
            </span>
          </div>
 
          <dl className="divide-y divide-border px-6">
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-body-text">Item</dt>
              <dd className="font-medium text-heading-text">CCRA Full Membership</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-body-text">Date</dt>
              <dd className="text-heading-text">
                {(paidAt ?? new Date()).toLocaleString("en-CA", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </dd>
            </div>
            {expiryDate && (
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-body-text">Valid through</dt>
                <dd className="text-heading-text">{expiryDate}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-3 text-sm">
              <dt className="shrink-0 text-body-text">Reference</dt>
              <dd className="truncate font-mono text-xs text-heading-text">{paymentId}</dd>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-body-text">Payment method</dt>
              <dd className="text-heading-text">Card · Stripe</dd>
            </div>
            <div className="flex items-baseline justify-between py-4">
              <dt className="font-semibold text-heading-text">Total paid</dt>
              <dd className="text-xl font-bold text-heading-text">${total.toFixed(2)} CAD</dd>
            </div>
          </dl>
        </div>
 
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/events/enter-rodeo"
            className={buttons.primaryButton}
          >
            Enter a Rodeo
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className={buttons.secondaryButton}
          >
            Print receipt
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className={pageStructure.pageWrapper}>
      <div className={"mx-auto max-w-5xl px-4 py-10"}>
        <a
          href="/membership"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-caption-text transition hover:text-body-text"
        >
          <ArrowLeft className="h-4 w-4" /> Back to membership
        </a>
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-heading-text">Complete your membership</h1>
 
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT — payment form */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            {state === "loading" && (
              <div className="flex flex-col items-center gap-3 py-16 text-body-text">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-primary" />
                Preparing secure checkout…
              </div>
            )}
            {state === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-danger">
                {errorMsg}
              </div>
            )}
            {state === "ready" && clientSecret && paymentId && (
              <Elements key={paymentId} stripe={stripePromise} options={{ clientSecret }}>
                <PayForm paymentId={paymentId} total={total} onPaid={handlePaid} />
              </Elements>
            )}
          </div>
 
          {/* RIGHT — summary */}
          <aside className="h-fit lg:sticky lg:top-10">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-heading-text">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Membership summary
              </h2>
 
              <div className="flex items-center justify-between text-sm">
                <span className="text-body-text">CCRA Full Membership</span>
                <span className="font-medium text-heading-text">${total.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs text-body-text">
                Valid through {membershipExpiryDate()}
              </p>
 
              <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-body-text">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-heading-text">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
 
              <p className="mt-5 rounded-lg bg-highlight px-3 py-2 text-xs text-accent-text">
                An active membership is required to enter rodeo events.
              </p>
 
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-caption-text">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure SSL checkout · Powered by Stripe
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
 
export default function MembershipCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-body-text">Loading…</div>
      }
    >
      <MembershipCheckout />
    </Suspense>
  );
}
 
 