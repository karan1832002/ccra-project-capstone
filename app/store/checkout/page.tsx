"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function CheckoutPage() {
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-stone-950 mb-6">Checkout</h1>

      {success && (
        <div className="flex items-start gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 mb-6 shadow-sm transition duration-200">
          <span className="text-lg">✅</span>
          <p>Your purchase was successful! Thank you for supporting CCRA.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-950 mb-2">Full Name</label>
          <input
            type="text"
            className="h-12 w-full rounded-md border border-stone-200 px-3 outline-none transition focus:border-orange-600"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-950 mb-2">Shipping Address</label>
          <input
            type="text"
            className="h-12 w-full rounded-md border border-stone-200 px-3 outline-none transition focus:border-orange-600"
            placeholder="Enter your address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-950 mb-2">Payment Method</label>
          <select
            className="h-12 w-full rounded-md border border-stone-200 px-3 outline-none transition focus:border-orange-600"
            required
          >
            <option value="">Select a method</option>
            <option>Credit Card</option>
            <option>PayPal</option>
          </select>
        </div>

        <ButtonPrimary label="Complete Purchase" />
      </form>
    </div>
  );
}
