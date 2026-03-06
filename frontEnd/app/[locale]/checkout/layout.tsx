"use client";

import CheckoutNavbar from "@/components/checkout/NavbarCheckout";
import React from "react";
import { useLocale } from "next-intl"; // لجلب اللغة الحالية فقط
import { setRequestLocale } from "next-intl/server";

interface CheckoutLayoutProps {
  logoUrl: string;
  productTitle?: string;
  productImage?: string;
  children: React.ReactNode;
}

export default function CheckoutLayout({

  children,
}: CheckoutLayoutProps) {
  
  const locale = useLocale();
  setRequestLocale(locale)
  return (
    <div 
      lang={locale} 
      dir={locale === 'ar' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50"
    >
      <CheckoutNavbar />

      <main className="mx-auto py-2 px-2">
        {children}
      </main>
    </div>
  );
}