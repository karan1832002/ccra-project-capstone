"use client";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function CartPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-stone-950 mb-6">Your Cart</h1>

      <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-stone-600 text-sm mb-4">
          You have 2 items in your cart.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-stone-200 pb-4">
            <span className="text-stone-950 font-medium">CCRA Hat</span>
            <span className="text-stone-600">$25.00</span>
          </div>

          <div className="flex justify-between border-b border-stone-200 pb-4">
            <span className="text-stone-950 font-medium">CCRA Shirt</span>
            <span className="text-stone-600">$35.00</span>
          </div>
        </div>

        <div className="flex justify-between py-4 font-semibold text-stone-950 border-t border-stone-200 mt-4">
          <span>Total</span>
          <span>$60.00</span>
        </div>

        <div className="text-right mt-6">
          <ButtonPrimary label="Proceed to Checkout →" onClick={() => router.push("/store/checkout")} />
        </div>
      </div>
    </div>
  );
}
