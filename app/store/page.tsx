"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/ui/Hero";
import { useCart } from "@/app/context/CartContext";

type Product = {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  image?: string;
  category?: string;
  stock: number;
  active: boolean;
};

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  function handleAddToCart(product: Product) {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.priceCents / 100,
      image: product.image,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/gateway/api/store/products", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const json = await res.json();
        setProducts(json.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading)
    return <div className="text-center py-20">Loading products...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Hero
        badge="OFFICIAL MERCHANDISE"
        title="CCRA Store"
        description="Shop official CCRA apparel, accessories, and merchandise. Show your support for the Canadian Cowboys Rodeo Association on and off the rodeo grounds."
      />

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-20">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-6"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>

            <p className="text-gray-700 mb-4">
              ${(product.priceCents / 100).toFixed(2)}
            </p>

            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.stock <= 0
                ? "Out of Stock"
                : addedId === product.id
                ? "Added ✓"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
