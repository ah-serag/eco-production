"use client";

import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CartBadge from "./cardCount";

export function CartNav() {
  return (
    <Link
      href="/cart_product"
      className="relative md:flex hidden sm:flex items-center justify-center text-slate-500 hover:text-secondary transition-all"
    >
      {/* Icon */}
      <ShoppingCart
        size={20}
        strokeWidth={2}
        className="transition-all"
      />

      {/* Badge */}
      <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-semibold text-white bg-green-400 rounded-full">
        <CartBadge />
      </span>
    </Link>
  );
}