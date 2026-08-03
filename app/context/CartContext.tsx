"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type CartItem = {
  id?: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

type NewCartItem = Omit<CartItem, "qty">;

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: NewCartItem) => void;
  removeItem: (index: number) => void;
  increaseQty: (index: number) => void;
  decreaseQty: (index: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Read from localStorage on initial client mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ccra-cart");
      if (raw) setCartItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Save to localStorage whenever cartItems updates (only after initial load)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("ccra-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, loaded]);

  const addToCart = (item: NewCartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.title === item.title);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        return updated;
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const increaseQty = (index: number) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (index: number) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
