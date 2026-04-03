"use client";

import React from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const t = useTranslations("orderSuccess");
  const locale = useLocale();
  const isAr = locale === "ar";
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "---";
  const router = useRouter();

  return (
    <div 
      dir={isAr ? "rtl" : "ltr"} 
      className="min-h-[500px] bg-[#F8FAFC] flex items-center justify-center p-2 antialiased"
    >
      <Card className="max-w-md w-full  border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white overflow-hidden">
        <CardContent className="py-1 px-8 text-center">
          
          {/* Success Icon Section */}
          <div className="relative mx-auto w-20 h-20 mb-8 mt-6">
            <div className="flex items-center justify-center w-full h-full bg-green-100 rounded-full border border-green-500">
              <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-[13px] text-slate-500 mb-8 leading-relaxed px-4 font-normal">
            {t.rich("description", {
              orderId: (chunks) => <span className="text-slate-900 font-semibold">#{orderId}</span>
            })}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-50 flex flex-col items-center">
              <Package size={15} className="text-slate-400 mb-2" />
              <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">
                {t("statusLabel")}
              </span>
              <span className="text-[11px] font-normal text-slate-700 mt-1">
                {t("statusValue")}
              </span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-50 flex flex-col items-center">
              <Calendar size={15} className="text-slate-400 mb-2" />
              <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">
                {t("expectedLabel")}
              </span>
              <span className="text-[11px] font-normal text-slate-700 mt-1">
                {t("expectedValue")}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/orders")}
              className="w-full h-12 rounded-2xl font-normal bg-green-800 hover:bg-green-800/80 text-white text-[11px] tracking-widest shadow-lg shadow-slate-100 gap-2 transition-all group"
            >
              {t("trackBtn")}
              {isAr ? (
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
            
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full h-12 rounded-2xl font-normal text-slate-400 hover:text-slate-900 hover:bg-slate-50 text-[10px] tracking-widest uppercase">
                {t("backBtn")}
              </Button>
            </Link>
          </div>

        </CardContent>

        <div className="h-1 w-full bg-slate-50 mt-6" />
      </Card>
    </div>
  );
}