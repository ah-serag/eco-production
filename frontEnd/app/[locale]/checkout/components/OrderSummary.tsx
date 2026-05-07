"use client";

import { useTranslations, useLocale } from "next-intl";
import CouponSection from "./CouponSection";

interface OrderSummaryProps {
  checkoutItems: any[];
  totalPrice: number;
  discountData: { discountAmount: number; finalTotal: number } | null;
  onDiscountApplied: (data: { discountAmount: number; finalTotal: number } | null) => void;
}

export default function OrderSummary({
  checkoutItems,
  totalPrice,
  discountData,
  onDiscountApplied,
}: OrderSummaryProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">
          {t("summaryTitle")}
        </h2>
      </div>

      {/* Items list */}
      <div className="px-5 divide-y divide-slate-50 max-h-64 overflow-y-auto">
        {checkoutItems.map((item: any) => (
          <div key={item.id} className="flex items-center gap-3 py-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 p-1">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -top-1.5 -end-1.5 w-4 h-4 bg-slate-700 text-white text-[9px] flex items-center justify-center rounded-full">
                {item.quantity}
              </span>
            </div>
            <p className="flex-1 text-[12px] font-normal text-slate-700 truncate">
              {item.title}
            </p>
            <p
              className="text-[12px] font-semibold text-slate-900 shrink-0"
              dir="ltr"
            >
              {isAr
                ? `${t("currency")} ${Math.trunc(
                    Number(item.price) * item.quantity
                  ).toLocaleString("en-US")}`
                : `${Math.trunc(
                    Number(item.price) * item.quantity
                  ).toLocaleString("en-US")} ${t("currency")}`}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <CouponSection
        checkoutItems={checkoutItems}
        discountData={discountData}
        onDiscountApplied={onDiscountApplied}
      />

      {/* Totals */}
      <div className="px-5 py-4 border-t border-slate-100 space-y-3">
        {discountData && (
          <>
            <div className="flex justify-between items-center text-[12px] text-slate-500">
              <span>{t("subtotal") || "Subtotal"}</span>
              <span dir="ltr">
                {Math.trunc(Number(totalPrice)).toLocaleString("en-US")}{" "}
                {t("currency")}
              </span>
            </div>
            <div className="flex justify-between items-center text-[12px] text-emerald-600 font-medium">
              <span>{t("discount") || "Discount"}</span>
              <span dir="ltr">
                -{Math.trunc(Number(discountData.discountAmount)).toLocaleString("en-US")}{" "}
                {t("currency")}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
            {t("total")}
          </span>
          <span
            className="text-[20px] font-semibold text-slate-900 tracking-tight"
            dir="ltr"
          >
            {isAr && (
              <span className="text-[11px] font-normal text-slate-400 me-1">
                {t("currency")}
              </span>
            )}
            {Math.trunc(
              Number(discountData ? discountData.finalTotal : totalPrice)
            ).toLocaleString("en-US")}
            {!isAr && (
              <span className="text-[11px] font-normal text-slate-400 ms-1">
                {t("currency")}
              </span>
            )}
          </span>
        </div>
      </div>
    </section>
  );
}
