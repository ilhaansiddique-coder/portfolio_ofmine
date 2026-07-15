"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "tpl_cart";

export interface CartItem {
  id: number;
  variantId?: number;
  variantLabel?: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock?: number;
  unlimitedStock?: boolean;
}

interface CartValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: number, variantId?: number) => void;
  updateQuantity: (id: number, quantity: number, variantId?: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const key = (id: number, variantId?: number) => `${id}-${variantId || 0}`;
const Ctx = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Guard so the empty initial state doesn't overwrite a saved cart before we load it.
  const [hydrated, setHydrated] = useState(false);

  // Load the saved cart once on mount (client only — localStorage is unavailable during SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore corrupt / unavailable storage */ }
    setHydrated(true);
  }, []);

  // Persist on every change, once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items, hydrated]);

  const addItem: CartValue["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const k = key(item.id, item.variantId);
      if (prev.some((i) => key(i.id, i.variantId) === k)) {
        return prev.map((i) => (key(i.id, i.variantId) === k ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem: CartValue["removeItem"] = (id, variantId) =>
    setItems((prev) => prev.filter((i) => key(i.id, i.variantId) !== key(id, variantId)));

  const updateQuantity: CartValue["updateQuantity"] = (id, quantity, variantId) =>
    setItems((prev) => prev.map((i) => (key(i.id, i.variantId) === key(id, variantId) ? { ...i, quantity: Math.max(1, quantity) } : i)));

  const clearCart = () => setItems([]);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart(): CartValue {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
