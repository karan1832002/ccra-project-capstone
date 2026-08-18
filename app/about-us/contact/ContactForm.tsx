"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactAction } from "./actions";
import type { ContactFormState } from "./actions";
import { buttons, inputField } from "@/lib/styles";

const initialState: ContactFormState = { success: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={buttons.primaryButton}
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, initialState);

  return (
    <div className="bg-surface rounded-md border border-border shadow-sm p-10">
      <h2 className="text-2xl font-semibold text-heading-text mb-8">
        Send Us a Message
      </h2>

      <form action={formAction} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className={inputField.label}
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className={`${inputField.input} ${inputField.inputHeight}`}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className={inputField.label}
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className={`${inputField.input} ${inputField.inputHeight}`}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className={inputField.label}
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`${inputField.input} ${inputField.inputHeight}`}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className={inputField.label}
          >
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={`${inputField.input} ${inputField.inputHeight}`}
            placeholder="403-555-0123"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className={inputField.label}
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className={`${inputField.input} ${inputField.textBoxHeight}`}
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