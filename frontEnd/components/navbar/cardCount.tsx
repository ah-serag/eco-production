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
      <span className=" px-1.5 py-0.5 rounded-md text-[11px] ">
        0
      </span>
    );
  }

  return (
    <span className=" px-1  text-[5px] py-0.5 sm:px-1.5 sm:py-0.5 rounded-md sm:text-[11px] transition-all duration-300">
      {count}
    </span>
  );
}