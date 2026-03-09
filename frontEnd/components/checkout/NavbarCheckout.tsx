"use client";

import Image from "next/image";
import {  ShieldCheck, MessageCircleMore } from "lucide-react";
import LanguageSwitcher from "../public/langSwitcher";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
 
export default function CheckoutNavbar() {

  const t = useTranslations("checkout") ;
  return (
    <nav className="bg-white shadow py-2 px-6 sticky top-0 z-50  border-slate-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/photo/tmara.svg" alt="Logo" width={90} height={35} priority />
          </Link>
             <Image 
            src="/photo/payment/delivery.svg" 
            alt="Delivery" 
            width={30} 
            height={30} 
            className="  md:hidden "
          />
          
       
        </div>

        <div className="flex self-center items-center gap-8">
          
          <Image 
            src="/photo/payment/delivery.svg" 
            alt="Delivery" 
            width={45} 
            height={30} 
            className=" hidden md:block "
          />
          
           <Image 
            src="/photo/payment/ABS-Egypt.webp" 
            alt="Egypt Post" 
            width={90} 
            height={30} 
            className="hidden sm:block "
          /> 
          <Image 
            src="/photo/payment/EGYPT_POST.svg" 
            alt="Egypt Post" 
            width={90} 
            height={30} 
            className="hidden sm:block "
          />

          <div className="hidden sm:flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-400" />
            <Image 
              src="/photo/maymob.png" 
              alt="Paymob" 
              width={100} 
              height={30} 
              className=" hidden sm:block"
            />
            </div>

        </div> 
            <div className="flex gap-4">

              <a 
            href="https://wa.me/201091714419" 
            target="_blank" 
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 rounded-full border shadow border-slate-100  hover:bg-green-50 transition-colors group"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <MessageCircleMore  size={14} className="text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">{t("support")}</span>
          </a>
          <LanguageSwitcher />

            </div>
        

      </div>
    </nav>
  );
}