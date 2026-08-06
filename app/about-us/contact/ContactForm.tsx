"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactAction } from "./actions";
import type { ContactFormState } from "./actions";

const initialState: ContactFormState = { success: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-orange-600 px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, initialState);

  return (
    <div className="bg-white rounded-md border border-stone-200 shadow-sm p-10 dark:border-stone-700 dark:bg-stone-900">
      <h2 className="text-2xl font-semibold text-stone-950 mb-8 dark:text-stone-100">
        Send Us a Message
      </h2>

      <form action={formAction} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300"
          >
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            placeholder="403-555-0123"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition resize-y dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            placeholder="How can we help you today?"
          />
        </div>

        {/* Feedback banner */}
        {state.message && (
          <div
            className={`rounded-md px-4 py-3 text-sm font-medium ${
              state.success
                ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
            }`}
          >
            {state.message}
          </div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}