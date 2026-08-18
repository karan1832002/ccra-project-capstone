"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { pageStructure, buttons, inputField } from "@/lib/styles";
import Hero from "@/components/ui/Hero";
import { membershipExpiryDate } from "@/lib/season";

export default function MembershipPage() {
  const router = useRouter();

  const [session, setSession] = useState<{
    id?: string;
    name?: string;
    email?: string;
  } | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState<{
    status: string;
    expiryDate?: string;
  } | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [division, setDivision] = useState("");
  const [events, setEvents] = useState<string[]>([]);

  const [signature, setSignature] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [agreeInfoCorrect, setAgreeInfoCorrect] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);

  const LOCAL_STORAGE_KEY = "ccra_membership_draft_v1";

  // LOAD SESSION AND DRAFT
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/auth/get-session");
        const data = await res.json();

        if (data?.user) {
          setSession(data.user);
          setFullName(data.user.name ?? "");
          setEmail(data.user.email ?? "");

          // Already a member? Show their status instead of the apply form.
          try {
            const statusRes = await fetch(
              `/api/gateway/api/memberships/status/${data.user.id}`,
            );
            const statusJson = await statusRes.json();
            if (statusJson?.data) setMembershipStatus(statusJson.data);
          } catch {
            // Non-fatal: fall through to the form.
          }
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      } finally {
        setLoadingSession(false);
      }

      const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setFullName(parsed.fullName ?? "");
          setEmail(parsed.email ?? "");
          setPhone(parsed.phone ?? "");
          setDivision(parsed.division ?? "");
          setEvents(parsed.events ?? []);
          setSignature(parsed.signature ?? "");
          setPaymentMethod(parsed.paymentMethod ?? "");
        } catch {}
      }
    }

    loadData();
  }, []);

  // PHONE FORMATTER
  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // VALIDATION
  function validate() {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!phone.trim()) newErrors.phone = "Contact number is required";
    if (!division) newErrors.division = "Division is required";
    if (events.length === 0) newErrors.events = "Select at least one event";
    if (!signature.trim())
      newErrors.signature = "Digital signature is required";
    if (!paymentMethod) newErrors.paymentMethod = "Select a payment method";

    if (!agreeInfoCorrect || !agreeRules) {
      newErrors.agreements = "You must certify info, and accept CCRA rules.";
    }

    setErrors(newErrors);
    return newErrors;
  }

  // EVENT TOGGLE
  function toggleEvent(eventName: string) {
    if (events.includes(eventName)) {
      setEvents(events.filter((e) => e !== eventName));
    } else {
      setEvents([...events, eventName]);
    }
  }

  // SAVE DRAFT
  function saveDraft() {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        fullName,
        email,
        phone,
        division,
        events,
        signature,
        paymentMethod,
      }),
    );
  }

  // SUBMIT MEMBERSHIP
  async function handleSubmit() {
    if (submitting) return;
    // Show exactly what's missing instead of failing silently.
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      alert(
        "Please complete the form:\n\n• " +
          Object.values(validationErrors).join("\n• "),
      );
      return;
    }
    // Must be signed in — this was failing silently before.
    if (!session?.id) {
      alert("Please sign in before submitting a membership application.");
      return;
    }

    setSubmitting(true);

    const userId = session.id;

    try {
      // 1. Create the membership application. It starts as "pending" and only
      //    becomes "active" once payment clears (via the payment-service webhook).
      const start = new Date();
      const startDate = start.toISOString().split("T")[0];
      const expiryDate = membershipExpiryDate(start);
      const membershipRes = await fetch("/api/gateway/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          membershipType: "full",
          startDate,
          expiryDate,
          fullName,
          email,
          phone,
          division,
          signature,
          events,
        }),
      });

      const membershipJson = await membershipRes.json();
      if (!membershipRes.ok || !membershipJson?.data?.id) {
        console.error("[membership] create failed:", membershipJson);
        alert(membershipJson?.error?.message ?? "Error creating membership.");
        setSubmitting(false);
        return;
      }
      const membershipId = membershipJson.data.id;

      if (paymentMethod === "card") {
        // 2. Hand off to the Stripe checkout page for this membership. Payment
        //    success there activates the membership.
        router.push(`/membership/checkout?mid=${membershipId}`);
        return; // keep spinner while navigating
      }

      if (paymentMethod === "etransfer") {
        router.push("/membership/etransfer-instructions");
        return;
      }

      setSubmitting(false);
    } catch (err) {
      console.error("[membership] submit error:", err);
      alert(
        "Network error while submitting. Is the backend running? Check the console.",
      );
      setSubmitting(false);
    }
  }

  // LOADING SCREEN
  if (loadingSession) {
    return (
      <div
        className={` ${pageStructure.pageWrapper} flex items-center justify-center`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-2xl font-bold text-heading-text">
            CCRA Membership
          </div>
          <div className="text-sm text-body-text">
            Checking your membership...
          </div>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // NOT SIGNED IN
  if (!session) {
    return (
      <div className={pageStructure.pageWrapper}>
        <Hero
          badge="CCRA MEMBERSHIP"
          title="Membership Registration"
          description="Become an official CCRA member."
        />

        <main className="mx-auto max-w-4xl px-4 py-10">
          <section className="mt-8 rounded-md border border-border bg-surface p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-heading-text">
              Please sign in to continue
            </h2>
            <p className="mt-2 text-sm text-body-text">
              You must have an account before purchasing a membership.
            </p>
            <Link href="/sign-in" className={`${buttons.primaryButton} mt-4`}>
              Sign In
            </Link>
          </section>
        </main>
      </div>
    );
  }

  // ALREADY AN ACTIVE MEMBER — no need to apply again.
  if (membershipStatus?.status === "active") {
    return (
      <div className={pageStructure.pageWrapper}>
        <Hero
          badge="CCRA MEMBERSHIP"
          title="My Membership"
          description="Your CCRA membership details and status."
        />

        <main className="mx-auto max-w-4xl px-4 pb-12 pt-0">
          {/* Membership summary — photo fills the left, details on the right. */}
          <section className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="grid sm:grid-cols-2">
              {/* Photo column — decorative, hidden on narrow screens */}
              <div className="relative hidden min-h-[300px] sm:block">
                <Image
                  src="/images/ccralineup.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 0px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Details column */}
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold tracking-tight text-heading-text">
                      {session.name || "Member"}
                    </h2>
                    <p className="mt-0.5 truncate text-sm text-body-text">
                      {session.email}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    Active
                  </span>
                </div>

                <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-body-text">Membership</dt>
                    <dd className="font-medium text-heading-text">
                      Full Membership
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-body-text">Valid through</dt>
                    <dd className="font-medium tabular-nums text-heading-text">
                      {membershipStatus.expiryDate ?? "—"}
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/events/enter-rodeo"
                  className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-text transition hover:bg-primary-dark"
                >
                  Enter a Rodeo
                </Link>
                <Link
                  href="/profile"
                  className="mt-3 block text-center text-sm font-medium text-body-text underline-offset-4 transition hover:text-heading-text hover:underline"
                >
                  View profile
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={pageStructure.pageWrapper}>
      <Hero
        badge="CCRA MEMBERSHIP"
        title="Membership Registration"
        description="Become an official CCRA member by completing the application below."
      />

      <main className={"mx-auto max-w-4xl px-6 py-8"}>
        {/* FORM CONTAINER */}
        <div className="mt-10 bg-surface border border-border rounded-xl shadow-sm p-8">
          {/* PERSONAL INFORMATION */}
          <h2 className="text-2xl font-bold text-heading-text mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FULL NAME */}
            <div>
              <label className={inputField.label}>Full Name *</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`${inputField.input} ${inputField.inputHeight} ${
                  errors.fullName ? "border-danger" : "border-input-border"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-xs text-danger mt-1">✖ {errors.fullName}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className={inputField.label}>Email Address *</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputField.input} ${inputField.inputHeight} ${
                  errors.email ? "border-danger" : "border-input-border"
                }`}
                placeholder="example@gmail.com"
              />
              {errors.email ? (
                <p className="text-xs text-danger mt-1">✖ {errors.email}</p>
              ) : email ? (
                <p className="text-xs text-success mt-1">✔ Looks good</p>
              ) : null}
            </div>

            {/* PHONE */}
            <div>
              <label className={inputField.label}>Contact Number *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className={`${inputField.input} ${inputField.inputHeight} ${
                  errors.phone ? "border-danger" : "border-input-border"
                }`}
                placeholder="(403) 555-8888"
              />
              {errors.phone && (
                <p className="text-xs text-danger mt-1">✖ {errors.phone}</p>
              )}
            </div>
          </div>

          {/* EVENT DECLARATIONS */}
          <h2 className="text-2xl font-bold text-heading-text mt-12 mb-6">
            Event Declarations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DIVISION */}
            <div>
              <label className={inputField.label}>Division *</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setDivision("Men")}
                  className={`px-4 py-2 rounded-md border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                    division === "Men"
                      ? "bg-primary text-primary-text border-primary"
                      : "border-input-border hover:bg-highlight"
                  }`}
                >
                  Men’s
                </button>

                <button
                  onClick={() => setDivision("Ladies")}
                  className={`px-4 py-2 rounded-md border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                    division === "Ladies"
                      ? "bg-primary text-primary-text border-primary"
                      : "border-input-border hover:bg-highlight"
                  }`}
                >
                  Ladies’
                </button>
              </div>
              {errors.division && (
                <p className="text-xs text-danger mt-1">✖ {errors.division}</p>
              )}
            </div>

            {/* EVENTS */}
            <div>
              <label className={inputField.label}>Primary Events *</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "🐂 Bull Riding",
                  "🐎 Barrel Racing",
                  "🤠 Team Roping",
                  "🎯 Tie-Down Roping",
                  "🐄 Steer Wrestling",
                  "🏇 Breakaway",
                ].map((label) => {
                  const event = label.replace(/^.\s/, "");
                  return (
                    <label
                      key={label}
                      className="flex items-center gap-2 text-body-text"
                    >
                      <input
                        type="checkbox"
                        checked={events.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="accent-primary"
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
              {errors.events && (
                <p className="text-xs text-danger mt-1">✖ {errors.events}</p>
              )}
            </div>
          </div>

          {/* SELECTED EVENTS */}
          <div className="mt-6">
            <p className="text-sm font-semibold">
              Selected Events ({events.length})
            </p>
            <div className="mt-2 rounded-lg border border-input-border bg-input-field p-3 text-sm space-y-1">
              {events.length === 0 && (
                <p className="text-caption-text">No events selected yet.</p>
              )}
              {events.map((e) => (
                <p key={e}>✓ {e}</p>
              ))}
            </div>
          </div>

          {/* LIABILITY */}
          <h2 className="text-2xl font-bold text-heading-text mt-12 mb-4">
            Liability & Rulebook Agreement
          </h2>

          <p className="text-body-text leading-relaxed mb-6">
            Rodeo is a dangerous activity. By submitting this application, you
            acknowledge that you assume all risks of injury or damage while
            participating in CCRA‑sanctioned events. You agree to abide by all
            rules and regulations outlined in the 2024 CCRA Rulebook.
          </p>

          {/* SIGNATURE */}
          <div className="mt-6">
            <label className={inputField.label}>Digital Signature *</label>
            <input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className={`${inputField.input} ${inputField.inputHeight} ${
                errors.signature ? "border-danger" : "border-input-border"
              }`}
              placeholder="Type your full name"
            />
            {errors.signature && (
              <p className="text-xs text-danger mt-1">✖ {errors.signature}</p>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <h2 className="text-2xl font-bold text-heading-text mt-12 mb-6">
            Order Summary
          </h2>

          <div className="border border-input-border rounded-lg p-6 bg-input-field">
            <div className="flex justify-between mb-2 text-body-text">
              <span>Full Membership 2026</span>
              <span>$175.00</span>
            </div>

            <div className="flex justify-between mb-2 text-body-text">
              <span>Processing Fee (5%)</span>
              <span>$8.75</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-4 text-heading-text">
              <span>Total</span>
              <span>$183.75</span>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <h2 className="text-2xl font-bold text-heading-text mt-12 mb-6">
            Payment Method
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            {/* CARD */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 text-left px-5 py-4 rounded-lg border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                paymentMethod === "card"
                  ? "bg-primary text-primary-text border-primary"
                  : "border-input-border bg-input-field hover:bg-highlight"
              }`}
            >
              <div className="font-semibold mb-1 text-heading-text">
                💳 Credit Card
              </div>
              <div className="text-xs text-body-text">
                Pay instantly with Visa, MasterCard, or Amex.
              </div>
            </button>

            {/* E-TRANSFER */}
            <button
              onClick={() => setPaymentMethod("etransfer")}
              className={`flex-1 text-left px-5 py-4 rounded-lg border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                paymentMethod === "etransfer"
                  ? "bg-primary text-primary-text border-primary"
                  : "border-input-border bg-input-field hover:bg-highlight"
              }`}
            >
              <div className="font-semibold mb-1 text-heading-text">
                🏦 E‑Transfer
              </div>
              <div className="text-xs text-body-text">
                Send payment to{" "}
                <span className="font-semibold">payments@ccra.ca</span> with
                your name as reference.
              </div>
            </button>
          </div>

          {errors.paymentMethod && (
            <p className="text-xs text-danger mt-1">✖ {errors.paymentMethod}</p>
          )}

          {/* CONFIRMATION CHECKBOXES */}
          <div className="mt-6 space-y-2 text-xs text-body-text">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeInfoCorrect}
                onChange={(e) => setAgreeInfoCorrect(e.target.checked)}
                className="accent-primary"
              />
              <span>I certify all information is correct.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeRules}
                onChange={(e) => setAgreeRules(e.target.checked)}
                className="accent-primary"
              />
              <span>I accept the CCRA Rules.</span>
            </label>

            {errors.agreements && (
              <p className="text-xs text-danger mt-1">✖ {errors.agreements}</p>
            )}

            {/* Simple bot check. validate() requires this before submitting. */}
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={captchaChecked}
                onChange={(e) => setCaptchaChecked(e.target.checked)}
                className="accent-primary"
              />
              <span>I&apos;m not a robot.</span>
            </label>

            {errors.captcha && (
              <p className="text-xs text-danger mt-1">✖ {errors.captcha}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`bg-primary hover:bg-primary-dark text-primary-text font-semibold px-6 py-3 rounded-lg w-full mt-10 transition-all shadow-md hover:scale-105 active:scale-95 ${
              submitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>

          <p className="text-xs text-caption-text mt-3 text-center">
            By clicking submit, you agree to the CCRA bylaws and 2024
            competition terms.
          </p>
        </div>
      </main>
    </div>
  );
}
