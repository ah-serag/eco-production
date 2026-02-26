"use client";

import React, { useState, useEffect } from "react";
import { Home, ShoppingCart, MessageCircle, Menu, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "./mobileSidebar";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const cart = JSON.parse(stored);
        setCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Cart", icon: ShoppingCart, href: "/cart_product", count: cartCount },
    { name: "Ask Us", icon: MessageCircle, href: "/contact" },
    { name: "Menu", icon: Menu, isAction: true, action: () => setIsSidebarOpen(true) },
    { name: "More", icon: MoreHorizontal, href: "/more" },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-50 h-16 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return item.isAction ? (
              <button
                key={item.name}
                onClick={item.action}
                className="flex flex-col items-center justify-center flex-1 gap-1 text-neutral-400 active:scale-90 transition-all"
              >
                <div className="p-1.5 rounded-full transition-colors">
                   <Icon size={20} />
                </div>
                <span className="text-[9px] font-medium uppercase tracking-wider">{item.name}</span>
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 gap-1 transition-all relative active:scale-95",
                  isActive ? "text-neutral-900" : "text-neutral-400"
                )}
              >
                {/* الخلفية الدائرية للأيقونة النشطة */}
                <div className={cn(
                  "p-1.5 px-4 rounded-full transition-all duration-300",
                  isActive ? "bg-chart-1/10" : "bg-transparent"
                )}>
                  <div className="relative">
                    <Icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 2}
                      className={cn(isActive && "fill-chart-1 text-chart-1")} 
                    />
                    {item.count ? (
                      <span className="absolute -top-2 -right-3 bg-neutral-900 text-white text-[8px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full border border-white">
                        {item.count}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className={cn(
                  "text-[9px] uppercase tracking-wider transition-colors",
                  isActive ? "font-bold text-neutral-900" : "font-medium"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}