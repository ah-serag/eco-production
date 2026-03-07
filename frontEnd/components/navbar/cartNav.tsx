"use client";

import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CartBadge from "./cardCount";

export function CartNav() {

  return (
    <Link 
      href="/cart_product" 
      className="md:flex hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"
    >
      <ShoppingBag 
        size={15} 
        strokeWidth={1.8} 
        className="text-slate-500 group-hover:text-black transition-colors" 
      />
      <span className="text-[9px] font-bold ">
        <CartBadge />
      </span>

    </Link>
  );
}