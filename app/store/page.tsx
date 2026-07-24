"use client";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function StorePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-stone-950 mb-6">
        CCRA Store
      </h1>

      <p className="text-stone-600 mb-8">
        Browse official CCRA merchandise and membership products.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
        {/* Product Card 1 */}
        <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <img src="/images/hat.png" alt="CCRA Hat" className="rounded-md mb-4" />
          <h3 className="text-xl font-semibold text-stone-950">CCRA Hat</h3>
          <p className="text-stone-600 text-sm mb-4">
            Classic rodeo cap with embroidered logo.
          </p>
          <ButtonPrimary label="Add to Cart" onClick={() => router.push("/store/cart")} />
        </div>

        {/* Product Card 2 */}
        <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <img src="/images/shirt.png" alt="CCRA Shirt" className="rounded-md mb-4" />
          <h3 className="text-xl font-semibold text-stone-950">CCRA Shirt</h3>
          <p className="text-stone-600 text-sm mb-4">
            Soft cotton tee with official logo.
          </p>
          <ButtonPrimary label="Add to Cart" onClick={() => router.push("/store/cart")} />
        </div>

        {/* Product Card 3 */}
        <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <img src="/images/mug.png" alt="CCRA Mug" className="rounded-md mb-4" />
          <h3 className="text-xl font-semibold text-stone-950">CCRA Mug</h3>
          <p className="text-stone-600 text-sm mb-4">
            Ceramic mug featuring the official CCRA logo.
          </p>
          <ButtonPrimary label="Add to Cart" onClick={() => router.push("/store/cart")} />
        </div>
      </div>
    </div>
  );
}
