"use client";

import React, { Suspense } from "react";
import {
  CheckCircle2, ShieldCheck, ArrowRight,
  Home, Hash, CreditCard, Package,
  Banknote, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

function OrderSuccessContent() {
  const t      = useTranslations("orderSuccess");
  const locale = useLocale();
  const isAr   = locale === "ar";

  const searchParams = useSearchParams();
  const router       = useRouter();
  const orderId      = searchParams.get("id") || "—";

  const details = [
    { icon: <Hash size={11} />,    label: t("label_order_id"), value: `#${orderId}`, mono: true },
    { icon: <Banknote size={11} />, label: t("label_method"),  value: t("method_value"), green: true },
    { icon: <Package size={11} />, label: t("label_status"),   value: t("status_value") },
    { icon: <Truck size={11} />,   label: t("label_delivery"), value: t("delivery_value") },
  ];

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f8f8f8] flex flex-col items-center justify-center p-6 antialiased font-sans"
    >
      <div className="max-w-sm w-full space-y-6">

        {/* Status card */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">{t("title")}</h1>
          </div>
          <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
            {t("status_value")}
          </span>
        </div>

        {/* Order details */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-2">
            <CreditCard size={13} className="text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {t("summary_title")}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {details.map((row, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span className="text-slate-300">{row.icon}</span>
                  {row.label}
                </span>
                <span className={cn(
                  "text-[11px] font-semibold text-slate-800",
                  row.mono  && "font-mono text-[10px] text-slate-600",
                  row.green && "text-emerald-600"
                )}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={() => router.push("/orders")}
            className="w-full h-11 rounded-xl text-[11px] font-semibold uppercase tracking-widest"
          >
            {t("btn_track")} <ArrowRight size={13} className={isAr ? "mr-2" : "ml-2"} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full h-11 text-slate-400 hover:text-slate-700 text-[10px] font-semibold uppercase tracking-widest"
          >
            <Home size={12} className={isAr ? "ml-2" : "mr-2"} /> {t("btn_home")}
          </Button>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 opacity-40 pb-4">
          <ShieldCheck size={11} className="text-slate-400" />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {t("security_note")}
          </span>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}
