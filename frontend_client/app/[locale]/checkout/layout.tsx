import CheckoutNavbar from "@/components/checkout/NavbarCheckout";
import React from "react";
import { setRequestLocale } from "next-intl/server";

export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CheckoutNavbar />

      <main className="mx-auto p-2 w-full max-w-7xl">
        {children}
      </main>
      
    </div>
  );
}