"use client";

import CheckoutNavbar from "@/components/checkout/NavbarCheckout";
import React from "react";

interface CheckoutLayoutProps {
  logoUrl: string;
  productTitle?: string;
  productImage?: string;
  children: React.ReactNode;
}

export default function CheckoutLayout({
  logoUrl,
  productTitle,
  productImage,
  children,
}: CheckoutLayoutProps) {


  return (
    <div className="min-h-screen bg-slate-50">
      <CheckoutNavbar
  
      />

      <main className=" mx-auto py-2 px-2">
        {children}
      </main>
    </div>
  );
}