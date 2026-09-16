"use client";

import { useState } from "react";
import { Loader2, Tag, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCheckCouponsMutation } from "@/redux/features/coupons/couponsApiSlice";

interface CouponSectionProps {
  checkoutItems: any[];
  onDiscountApplied: (data: { discountAmount: number; finalTotal: number } | null) => void;
  discountData: { discountAmount: number; finalTotal: number } | null;
}

export default function CouponSection({
  checkoutItems,
  onDiscountApplied,
  discountData,
}: CouponSectionProps) {
  const t = useTranslations("checkout");
  const [checkCoupons, { isLoading: isCheckingCoupon }] = useCheckCouponsMutation();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  async function handleApplyCoupon() {
    setCouponError("");
    if (!couponCode.trim()) return;
    const couponUpperCase = couponCode.toUpperCase();
    try {
      const res = await checkCoupons({
        itemscheckout: checkoutItems,
        couponCode: couponUpperCase,
      }).unwrap();
      onDiscountApplied({
        discountAmount: res.discountAmount,
        finalTotal: res.finalTotal,
      });
    } catch (err: any) {
      setCouponError(err?.data?.error || "Invalid coupon code");
      onDiscountApplied(null);
    }
  }

  return (
    <div className="px-5 py-4 pt-20 border-t border-slate-100 bg-slate-50/50 space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={t("couponPlaceholder") || "Enter coupon code"}
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              if (couponError) setCouponError("");
            }}
            disabled={isCheckingCoupon || !!discountData}
            className={cn(
              "h-10 text-[12px] rounded-xl border-slate-200 ps-9 transition-colors",
              couponError && "border-red-400 focus-visible:ring-red-100",
              discountData && "border-emerald-200 bg-emerald-50/50 text-emerald-700"
            )}
          />
          <Tag
            size={14}
            className={cn(
              "absolute start-3 top-1/2 -translate-y-1/2",
              discountData ? "text-emerald-500" : "text-green-400"
            )}
          />
        </div>
        <button
          onClick={handleApplyCoupon}
          disabled={isCheckingCoupon || !couponCode || !!discountData}
          className="h-10 px-5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-[10px] uppercase font-semibold tracking-widest disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center min-w-[80px]"
        >
          {isCheckingCoupon ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            t("apply") || "Apply"
          )}
        </button>
      </div>

      {couponError && (
        <p className="text-[10px] text-red-500 ms-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {couponError}
        </p>
      )}

      {discountData && (
        <p className="text-[10px] text-emerald-600 ms-1 flex items-center gap-1 animate-in fade-in duration-200 font-medium">
          <ShieldCheck size={12} />
          {t("couponApplied") || "Coupon applied successfully"}
        </p>
      )}
    </div>
  );
}
