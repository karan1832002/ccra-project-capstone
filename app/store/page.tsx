"use client";

import { useEffect, useState, useMemo } from "react";
import Hero from "@/components/ui/Hero";
import { useCart } from "@/app/context/CartContext";
import ShopFilterBar from "@/components/ui/ShopFilterBar";

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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { addToCart } = useCart();

  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "" || p.category?.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  if (loading)
    return <div className="text-center py-20 text-foreground">Loading products...</div>;

  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  const categories = Array.from(
    new Set(
      products
        .map((p) => p.category)
        .filter((category): category is string => category !== undefined)
    )
  );

  return (
    <div className="min-h-screen bg-background">

      <Hero
        badge="OFFICIAL MERCHANDISE"
        title="CCRA Store"
        description="Shop official CCRA apparel, accessories, and merchandise."
      />

      <div className="max-w-6xl mx-auto px-6 mt-10 mb-10">
        <ShopFilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-20 relative">
        {filteredProducts.length === 0 && (
          <div className="text-muted-foreground text-lg col-span-3">
            No products match your search.
          </div>
        )}

        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-xl shadow border border-border hover:shadow-md transition p-6 flex flex-col relative"
          >
            {/* IMAGE triggers popup */}
            <div
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPopupPos({
                  top: rect.top + window.scrollY,
                  left: rect.right + 20,
                });
                setHoveredProduct(product);
              }}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-1">
              {product.name}
            </h3>

            <p className="text-muted-foreground mb-4 font-medium">
              ${(product.priceCents / 100).toFixed(2)}
            </p>

            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed mt-auto"
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

      {/* POPUP */}
      {hoveredProduct && (
        <div
          className="
            absolute w-72 p-4 rounded-xl shadow-xl
            bg-card border border-border
            pointer-events-auto z-[9999]
          "
          style={{
            top: popupPos.top,
            left: popupPos.left,
          }}
        >
          <h3 className="text-lg font-semibold text-foreground">
            {hoveredProduct.name}
          </h3>

          {hoveredProduct.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {hoveredProduct.description}
            </p>
          )}

          <p className="text-red-700 font-bold mt-3">
            ${(hoveredProduct.priceCents / 100).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
