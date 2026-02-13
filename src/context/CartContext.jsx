// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // load from localStorage if available
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ── Mutations ───────────────────────────────
  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      } else {
        return [...prev, { ...product, qty }];
      }
    });
  }, []);

  const increaseQty = useCallback((id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ── Derived values ─────────────────────────
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const subtotal   = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping   = subtotal === 0 ? 0 : subtotal > 25 ? 0 : 5.99;
  const tax        = subtotal * 0.08;
  const total      = subtotal + shipping + tax;

  return (
    <CartContext.Provider value={{
      cart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart,
      totalItems, subtotal, shipping, tax, total
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
