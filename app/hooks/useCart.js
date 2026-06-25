"use client";

import { useState, useEffect } from "react";

// Safe JSON parser helper
function getStorageCart() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("ai_digital_cart");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse cart data from localStorage", e);
    return [];
  }
}

function setStorageCart(cart) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("ai_digital_cart", JSON.stringify(cart));
    // Trigger custom event for other components to listen to
    window.dispatchEvent(new Event("cart-updated"));
  } catch (e) {
    console.error("Failed to save cart data to localStorage", e);
  }
}

export function useCart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Initial load
    setItems(getStorageCart());

    // Listen to updates from other components
    const handleUpdate = () => {
      setItems(getStorageCart());
    };

    window.addEventListener("cart-updated", handleUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleUpdate);
    };
  }, []);

  const addToCart = (item) => {
    const current = getStorageCart();
    
    // We unique items based on name to avoid duplicate plans
    const exists = current.some((i) => i.name === item.name);
    if (!exists) {
      const updated = [...current, item];
      setStorageCart(updated);
      setItems(updated);
    }
  };

  const removeFromCart = (name) => {
    const current = getStorageCart();
    const updated = current.filter((i) => i.name !== name);
    setStorageCart(updated);
    setItems(updated);
  };

  const clearCart = () => {
    setStorageCart([]);
    setItems([]);
  };

  const cartCount = items.length;
  
  const cartTotal = items.reduce((sum, item) => {
    // Clean price string if it has commas
    const priceVal = typeof item.price === "string" 
      ? parseInt(item.price.replace(/,/g, ""), 10) 
      : item.price;
    return sum + (priceVal || 0);
  }, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  };
}
