"use client";

import { useEffect, useState } from "react";
// 1. Import useSelector to listen to Redux state
import { useSelector } from "react-redux";

export default function CartBadge() {
  const items = useSelector((state: any) => state.cart.cartItems);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = items.length;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <span className="">
        0
      </span>
    );
  }

  return (
    <span className="    transition-all duration-300">
      {count}
    </span>
  );
}