"use client";

import Image from "next/image";
import { ShieldCheck, MessageCircle } from "lucide-react";
import LanguageSwitcher from "../public/langSwitcher";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CheckoutNavbar() {
  const t = useTranslations("checkout");

  const secondaryImageStyle = "grayscale opacity-30 hover:opacity-70 transition-opacity duration-300";

  return (
    <nav className="bg-white shadow-sm py-2 px-6 sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex  shrink-0">
                 <Link href="/" className="group flex items-center">
                   <span className="text-2xl font-serif font-bold tracking-widest uppercase text-cyan-900">GOTIY</span>
                 </Link>
               </div>
        </div>



        <div className="flex gap-4">
          <a 
            href="https://wa.me/201091714419" 
            target="_blank" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full  hover:bg-green-50 transition-colors group"
          >
            <MessageCircle  size={14} className="text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">{t("support")}</span>
          </a>
          <LanguageSwitcher />
        </div>
        
      </div>
    </nav>
  );
}