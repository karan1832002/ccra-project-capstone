"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setSuccess(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">

      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-orange-700 mb-4 text-center">
        Checkout
      </h1>

      {/* Success Banner */}
      {success && (
        <div className="flex items-start gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 mb-6 shadow-sm">
          <span className="text-lg">✅</span>
          <p>Your purchase was successful! Thank you for supporting CCRA.</p>
        </div>
      )}

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-stone-950 mb-2">
            Full Name
          </label>
          <input
            type="text"
            className="h-12 w-full rounded-md border border-stone-200 px-3 outline-none transition focus:border-orange-600"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-stone-950 mb-2">
            Shipping Address
          </label>
          <input
            type="text"
            className="h-12 w-full rounded-md border border-stone-200 px-3 outline-none transition focus:border-orange-600"
            placeholder="Enter your address"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-stone-950 mb-2">
            Payment Method
          </label>
          <select
            className="h-12 w-full rounded-md border border-stone-200 px-3 outline-none transition focus:border-orange-600"
            required
          >
            <option value="">Select a method</option>
            <option>Credit Card</option>
            <option>PayPal</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Complete Purchase
        </button>
      </form>

    </div>
  );
}
