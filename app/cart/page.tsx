"use client";

import { useState } from "react";
import Link from "next/link";
import { pageStructure, buttons } from "@/lib/styles";
import Hero from "@/components/ui/Hero";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cartItems, removeItem, increaseQty, decreaseQty, clearCart } =
    useCart();

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const confirmRemove = () => {
    if (removeIndex !== null) removeItem(removeIndex);
    setShowRemoveModal(false);
    setRemoveIndex(null);
  };

  const confirmClear = () => {
    clearCart();
    setShowClearModal(false);
  };

  return (
    <div className={pageStructure.pageWrapper}>
      <Hero
        title="Your Cart"
        description="Review your items before checkout."
      />
      <div className={pageStructure.contentContainer}>

        {cartItems.length === 0 ? (
          <div className="rounded-md border border-border bg-surface shadow-sm p-12 text-center">
            <h2 className="text-xl font-semibold text-body-text mb-2">
              No items in your cart yet
            </h2>

            <p className="text-sm text-caption-text mb-8">
              Looks like you haven’t added anything yet.
            </p>

            <Link
              href="/store"
              className={buttons.primaryButton}
            >
              🛒 Go to Store
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* CLEAR CART BUTTON */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-caption-text">
                You have {cartItems.length} items in your cart.
              </p>

              <button
                onClick={() => setShowClearModal(true)}
                className="rounded-md bg-danger px-4 py-2 text-sm font-semibold text-danger-text hover:bg-danger-dark transition"
              >
                Clear Cart
              </button>
            </div>

            {/* CART ITEMS */}
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="rounded-md border border-border bg-surface p-6 shadow-sm flex items-center gap-6"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 rounded-md object-cover"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-body-text">
                    {item.title}
                  </h3>
                  <p className="text-caption-text">${item.price}</p>

                  {/* QUANTITY SELECTOR */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(index)}
                      className="px-3 py-1 bg-accent rounded-md hover:bg-accent/70"
                    >
                      –
                    </button>

                    <span className="text-lg font-semibold text-body-text">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(index)}
                      className="px-3 py-1 bg-accent rounded-md hover:bg-accent/70"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => {
                    setRemoveIndex(index);
                    setShowRemoveModal(true);
                  }}
                  className="rounded-md bg-danger px-4 py-2 text-sm font-semibold text-danger-text hover:bg-danger-dark transition"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* TOTAL */}
            <div className="text-right text-xl font-semibold text-body-text">
              Total: ${total.toFixed(2)}
            </div>

            <Link
              href="/store/checkout"
              className={buttons.primaryButton}
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}

        {/* REMOVE ITEM MODAL */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg p-6 w-80 shadow-lg border border-border">
              <h2 className="text-xl font-bold text-danger mb-3">
                ⚠️ Remove Item?
              </h2>

              <p className="text-body-text mb-6">
                Are you sure you want to remove this item from your cart?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="px-4 py-2 rounded-md bg-accent hover:bg-accent/70"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmRemove}
                  className="px-4 py-2 rounded-md bg-danger text-danger-text hover:bg-danger-dark"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CLEAR CART MODAL */}
        {showClearModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg p-6 w-80 shadow-lg border border-border">
              <h2 className="text-xl font-bold text-danger mb-3">
                ⚠️ Clear Cart?
              </h2>

              <p className="text-body-text mb-6">
                Are you sure you want to remove all items from your cart? This
                action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="px-4 py-2 rounded-md bg-accent hover:bg-accent/70"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmClear}
                  className="px-4 py-2 rounded-md bg-danger text-danger-text hover:bg-danger-dark"
                >
                  Yes, Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
