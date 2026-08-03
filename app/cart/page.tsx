"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cartItems, removeItem, increaseQty, decreaseQty, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      {/* RULEBOOK STYLE HEADING */}
      <h1 className="text-3xl font-bold text-orange-700 mb-4 text-center">
        Your Cart
      </h1>

      <p className="text-gray-600 text-center mb-8">
        Review your items before checkout.
      </p>

      {cartItems.length === 0 ? (
        <div className="rounded-md border border-stone-200 bg-white shadow-sm p-12 text-center">
          <h2 className="text-xl font-semibold text-stone-950 mb-2">
            No items in your cart yet
          </h2>
          <p className="text-sm text-stone-600 mb-8">
            Looks like you haven’t added anything yet.
          </p>

          <a
            href="/store"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            🛒 Go to Store
          </a>
        </div>
      ) : (
        <div className="space-y-6">

          {/* CLEAR CART BUTTON */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-stone-600">
              You have {cartItems.length} items in your cart.
            </p>

            <button
              onClick={clearCart}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              Clear Cart
            </button>
          </div>

          {/* CART ITEMS */}
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="rounded-md border border-stone-200 bg-white p-6 shadow-sm flex items-center gap-6"
            >
              {/* PRODUCT IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 rounded-md object-cover"
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-stone-950">{item.title}</h3>
                <p className="text-stone-600">${item.price}</p>

                {/* QUANTITY SELECTOR */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => decreaseQty(index)}
                    className="px-3 py-1 bg-stone-200 rounded-md hover:bg-stone-300"
                  >
                    –
                  </button>

                  <span className="text-lg font-semibold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(index)}
                    className="px-3 py-1 bg-stone-200 rounded-md hover:bg-stone-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeItem(index)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}

          {/* TOTAL */}
          <div className="text-right text-xl font-semibold text-stone-950">
            Total: ${total.toFixed(2)}
          </div>

          {/* CHECKOUT BUTTON */}
          <Link
            href="/store/checkout"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Proceed to Checkout →
          </Link>
        </div>
      )}

    </div>
  );
}
