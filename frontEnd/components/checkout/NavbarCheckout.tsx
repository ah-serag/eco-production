"use client";

import Image from "next/image";
import { Lock, ShieldCheck, HelpCircle, Phone } from "lucide-react";
import LanguageSwitcher from "../public/langSwitcher";
import { Link } from "@/i18n/navigation";

export default function CheckoutNavbar() {
  return (
    <nav className="bg-white shadow-sm py-2 px-6 sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/photo/logoVexa.svg" alt="Logo"  width={80}  height={35}  priority />
          </Link>

          <a 
            href="https://wa.me/201091714419" 
            target="_blank" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 hover:bg-green-50 transition-colors group"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <Phone size={14} className="text-slate-600" />
            <span className="text-xs font-bold text-slate-700">whatsApp support</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher/>

          <div className="hidden sm:flex items-center gap-3">
             <ShieldCheck size={20} className="text-green-400" />
             <Image 
                src="/photo/maymob.png" 
                alt="Paymob" 
                width={90} 
                height={30} 
                className="opacity-80"
             />
          </div>

     
        </div>

      </div>
    </nav>
  );
}