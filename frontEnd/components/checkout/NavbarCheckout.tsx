"use client";

import Image from "next/image";
import { ShieldCheck, MessageCircleMore } from "lucide-react";
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
          <Link href="/" className="flex items-center">
            <Image 
              src="/photo/gotiy.svg" 
              alt="Logo" 
              width={130} 
              height={35} 
              priority 
            />
          </Link>
        </div>

        <div className="flex self-center items-center gap-8">
          <Image 
            src="/photo/payment/ABS-Egypt.webp" 
            alt="Egypt Post" 
            width={90} 
            height={30} 
            className={`hidden sm:block ${secondaryImageStyle}`}
          /> 

          <div className="hidden sm:flex items-center gap-2">
            <ShieldCheck size={20} className="text-slate-300" />
            <Image 
              src="/photo/maymob.png" 
              alt="Paymob" 
              width={100} 
              height={30} 
              className={secondaryImageStyle}
            />
          </div>
        </div> 

        <div className="flex gap-4">
          <a 
            href="https://wa.me/201091714419" 
            target="_blank" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm border-slate-100 hover:bg-green-50 transition-colors group"
          >
            <MessageCircleMore size={14} className="text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">{t("support")}</span>
          </a>
          <LanguageSwitcher />
        </div>
        
      </div>
    </nav>
  );
}