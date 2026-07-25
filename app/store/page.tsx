"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import { useCart } from "@/app/context/CartContext";

type Product = {
  title: string;
  price: number;
  image: string;
};

type ProductCardProps = {
  image: string;
  title: string;
  price: number;
  description: string;
  onAdd: () => void;
};

type MembershipCardProps = {
  tier: string;
  price: string;
  benefits: string[];
  buttonLabel: string;
  primary: boolean;
  onClick: () => void;
};

export default function StorePage() {
  const router = useRouter();
  const { addToCart } = useCart();

  function handleAdd(product: Product) {
    addToCart(product);
    router.push("/cart");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 bg-stone-50">

      {/* HERO */}
      <section className="py-12 text-center">
        <h1 className="text-5xl font-semibold text-stone-950 mb-4">
          The Frontier Collection
        </h1>

        <p className="text-stone-600 max-w-3xl mx-auto mb-6">
          Handcrafted leather saddles and premium rodeo gear built for riders
          who demand excellence.
        </p>

        <p className="text-stone-500 max-w-xl mx-auto mb-8 text-base leading-relaxed">
          Crafting the standard for rodeo excellence since 1974.
        </p>

        <div className="flex justify-center gap-4">
          <ButtonPrimary
            label="Shop Equipment"
            onClick={() =>
              document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <ButtonSecondary
            label="Membership"
            onClick={() =>
              document.getElementById("membership")?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="py-10">
        <h2 className="text-3xl font-semibold text-stone-950 mb-8 text-center">
          Featured Equipment & Apparel
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">

          <ProductCard
            image="/images/shirt.png"
            title="Frontier Graphic Tee"
            price={24.99}
            description="Soft cotton tee with bold CCRA frontier graphic."
            onAdd={() =>
              handleAdd({
                title: "Frontier Graphic Tee",
                price: 24.99,
                image: "/images/shirt.png",
              })
            }
          />

          <ProductCard
            image="/images/trophybuckle.png"
            title="CCRA Trophy Buckle"
            price={65.0}
            description="Polished silver buckle engraved with CCRA emblem."
            onAdd={() =>
              handleAdd({
                title: "CCRA Trophy Buckle",
                price: 65.0,
                image: "/images/trophybuckle.png",
              })
            }
          />

          <ProductCard
            image="/images/cap.png"
            title="Classic Trucker Hat"
            price={30.0}
            description="Mesh-back trucker hat with stitched CCRA logo."
            onAdd={() =>
              handleAdd({
                title: "Classic Trucker Hat",
                price: 30.0,
                image: "/images/cap.png",
              })
            }
          />

          <ProductCard
            image="/images/hat.png"
            title="CCRA Black Hat"
            price={39.99}
            description="Premium black cowboy hat with embroidered crest."
            onAdd={() =>
              handleAdd({
                title: "CCRA Black Hat",
                price: 39.99,
                image: "/images/hat.png",
              })
            }
          />

          <ProductCard
            image="/images/mug.png"
            title="Heritage Branded Mug"
            price={14.99}
            description="Durable enamel mug featuring the CCRA heritage mark."
            onAdd={() =>
              handleAdd({
                title: "Heritage Branded Mug",
                price: 14.99,
                image: "/images/mug.png",
              })
            }
          />

          <ProductCard
            image="/images/keychain.png"
            title="Leather Keychain"
            price={12.99}
            description="Hand-stitched leather keychain stamped with CCRA logo."
            onAdd={() =>
              handleAdd({
                title: "Leather Keychain",
                price: 12.99,
                image: "/images/keychain.png",
              })
            }
          />
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section id="membership" className="py-16">
        <h2 className="text-3xl font-semibold text-stone-950 mb-8 text-center">
          Join the Association
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          <MembershipCard
            tier="Basic"
            price="$45/year"
            benefits={["Standard Store Discount"]}
            buttonLabel="Select This"
            primary={false}
            onClick={() => router.push("/store/checkout")}
          />

          <MembershipCard
            tier="Pro Member"
            price="$95/year"
            benefits={[
              "Standard Store Discount",
              "Event Access",
            ]}
            buttonLabel="Select This"
            primary={true}
            onClick={() => router.push("/store/checkout")}
          />

          <MembershipCard
            tier="Champion"
            price="$250/year"
            benefits={[
              "Standard Store Discount",
              "Event Access",
              "VIP Benefits",
            ]}
            buttonLabel="Select This"
            primary={false}
            onClick={() => router.push("/store/checkout")}
          />
        </div>
      </section>

    </div>
  );
}

/* PRODUCT CARD */
function ProductCard({
  image,
  title,
  price,
  description,
  onAdd,
}: ProductCardProps) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
      <Image
        src={image}
        alt={title}
        width={400}
        height={300}
        className="rounded-md mb-4 w-full h-48 object-cover"
      />

      <h3 className="text-xl font-semibold text-stone-950">
        {title}
      </h3>

      <p className="text-stone-600 text-sm mb-2">
        {description}
      </p>

      <p className="text-stone-950 font-semibold mb-4">
        ${price.toFixed(2)}
      </p>

      <ButtonPrimary
        label="Add"
        onClick={onAdd}
      />
    </div>
  );
}

/* MEMBERSHIP CARD */
function MembershipCard({
  tier,
  price,
  benefits,
  buttonLabel,
  primary,
  onClick,
}: MembershipCardProps) {
  return (
    <div
      className={`rounded-md p-6 shadow-sm text-center flex flex-col min-h-[330px] ${
        primary
          ? "border border-orange-600 bg-orange-50"
          : "border border-stone-200 bg-white"
      }`}
    >
      <h3 className="text-xl font-semibold text-stone-950 mb-2">
        {tier}
      </h3>

      <p className="text-stone-600 mb-4">
        {price}
      </p>

      <ul className="text-stone-500 text-sm mb-6 space-y-2 min-h-[110px]">
  {benefits.map((benefit) => (
    <li key={benefit}>
      • {benefit}
    </li>
  ))}
</ul>

<div className="mt-auto pt-4">
  {primary ? (
    <ButtonPrimary
      label={buttonLabel}
      onClick={onClick}
    />
  ) : (
    <ButtonSecondary
      label={buttonLabel}
      onClick={onClick}
    />
  )}
</div>
    </div>
  );
}
