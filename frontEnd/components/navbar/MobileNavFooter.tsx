"use client";

import React, { useState } from "react";
import { Home, ShoppingBag, Menu, MoreHorizontal, Phone } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation"; // تحديث الـ Link للـ i18n
import { MobileSidebar } from "./mobileSidebar";
import { cn } from "@/lib/utils";
import CartBadge from "./cardCount"; 
import { useTranslations } from "next-intl"; // استيراد الترجمة

export default function MobileBottomNav() {
  const t = useTranslations("mobileNav"); // استخدام مفتاح mobileNav
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const NavIcon = ({ path, icon: Icon, label, isBadge = false, isAction = false, action }: any) => {
    const active = isActive(path);
    const content = (
      <div className="flex flex-col items-center justify-center gap-1 transition-all active:scale-90">
        <div className={cn(
          "relative p-2 rounded-xl border border-slate-100 transition-all duration-300", 
          active ? "bg-chart-1 " : "bg-transparent"
        )}>
          <Icon 
            size={18} 
            strokeWidth={1.2} 
            className={cn("transition-colors", active ? "text-white" : "text-slate-400")} 
          />
          {isBadge && (
            <span className={cn(
              "absolute -top-1 -right-1 text-[7px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full border-2",
              active ? "bg-white text-chart-1 " : " text-white border-white"
            )}>
              <CartBadge />
            </span>
          )}
        </div>
        <span className={cn(
          "text-[8px] font-medium tracking-widest uppercase",
          active ? "text-chart-1 font-bold" : "text-slate-400"
        )}>{label}</span>
      </div>
    );

    return isAction ? (
      <button onClick={action} className="flex-1">{content}</button>
    ) : (
      <Link href={path} className="flex-1">{content}</Link>
    );
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 h-16 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center h-full max-w-md mx-auto px-2">
          
          {/* 1. Contact (WhatsApp Link via Phone Icon) */}
          <Link href="https://wa.me/201091714419" target="_blank" className="flex-1">
             <div className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-all">
                <div className="p-2 rounded-xl bg-transparent border border-slate-50">
                   <Phone size={18} strokeWidth={1.2} className="text-slate-400" />
                </div>
                <span className="text-[8px] font-medium tracking-widest uppercase text-slate-400">{t("contact")}</span>
             </div>
          </Link>

          {/* 2. Cart */}
          <NavIcon path="/cart_product" icon={ShoppingBag} label={t("cart")} isBadge={true} />

          {/* 3. HOME (THE CENTER) */}
          <Link href="/" className="flex-1 flex flex-col items-center justify-center">
             <div className={cn(
               "p-2.5 rounded-2xl transition-all duration-300",
               isActive("/") ? "bg-chart-1 " : "bg-slate-50 border border-slate-100"
             )}>
                <Home 
                  size={22} 
                  strokeWidth={1.2} 
                  className={cn(isActive("/") ? "text-white" : "text-slate-500")} 
                />
             </div>
          </Link>

          {/* 4. Menu */}
          <NavIcon 
            isAction 
            action={() => setIsSidebarOpen(true)} 
            icon={Menu} 
            label={t("menu")} 
            path="/menu-active-check" 
          />

          {/* 5. More */}
          <NavIcon path="/more" icon={MoreHorizontal} label={t("more")} />

        </div>
      </nav>

      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}