"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCartFromStorage } from "@/redux/features/cartSlice/cartSlice";

export default function CartBadge() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.cart.cartItems);
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  useEffect(() => {
    setCount(items.length);
  }, [items.length]);

  return <span className="transition-all">{count}</span>;
}