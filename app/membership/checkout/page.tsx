"use client";

import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}