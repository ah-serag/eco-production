"use client";

import { Loader2, CreditCard, Wallet, Banknote, Lock, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getBillingSchema } from "@/lib/checkout.schema";

type PaymentType = "card" | "wallet" | "cash";

interface PaymentSectionProps {
  paymentType: PaymentType;
  walletNumber: string;
  isLoading: boolean;
  checkoutError: string;
  hasItems: boolean;
  onPaymentTypeChange: (type: PaymentType) => void;
  onWalletNumberChange: (value: string) => void;
  onCheckout: () => void;
}

export default function PaymentSection({
  paymentType,
  walletNumber,
  isLoading,
  checkoutError,
  hasItems,
  onPaymentTypeChange,
  onWalletNumberChange,
  onCheckout,
}: PaymentSectionProps) {
  const t = useTranslations("checkout");

  const phoneSchema = getBillingSchema(t).shape.phone_number;
  const isValidEgyptPhone = phoneSchema.safeParse(walletNumber).success;

  const methods: { key: PaymentType; Icon: typeof CreditCard }[] = [
    { key: "card", Icon: CreditCard },
    { key: "wallet", Icon: Wallet },
    { key: "cash", Icon: Banknote },
  ];

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
      <h2 className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">
        {t("paymentMethod")}
      </h2>

      {/* Method Selector */}
      <div className="grid grid-cols-3 gap-2">
        {methods.map(({ key, Icon }) => (
          <button
            key={key}
            onClick={() => onPaymentTypeChange(key)}
            className={cn(
              "h-14 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200",
              paymentType === key
                ? "bg-cyan-900 text-neutral-100"
                : "border-slate-200 text-slate-400 hover:bg-slate-50"
            )}
          >
            <Icon size={15} />
            <span className="text-[9px] uppercase tracking-widest font-medium">
              {t(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Error Display */}
      {checkoutError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={14} className="shrink-0" />
          <p className="text-[10px] font-medium leading-tight">{checkoutError}</p>
        </div>
      )}

      {/* Payment Logos */}
      <div className="flex items-center justify-center gap-3 py-1">
        {paymentType === "cash" ? (
          <span className="text-[10px] text-slate-400 italic">{t("cashInfo")}</span>
        ) : paymentType === "card" ? (
          <>
            <img src="/photo/payment/visa.svg" className="h-3.5 w-auto opacity-30" alt="visa" />
            <img src="/photo/payment/mastercard.svg" className="h-5 w-auto opacity-30" alt="mastercard" />
            <img src="/photo/payment/Meeza.svg" className="h-3.5 w-auto opacity-30" alt="meeza" />
          </>
        ) : (
          <>
            <img src="/photo/payment/Vodafone_cash.svg" className="h-7 w-auto opacity-30" alt="vodafone" />
            <img src="/photo/payment/Logo_Orange_Money.svg" className="h-4 w-auto opacity-30" alt="orange" />
            <img src="/photo/payment/Etisalat_eand_Logo_EN.svg" className="h-3.5 w-auto opacity-30" alt="etisalat" />
          </>
        )}
      </div>

      {/* Wallet Number Input */}
      {paymentType === "wallet" && (
        <div className="relative animate-in flex flex-col gap-2 fade-in slide-in-from-top-1 duration-200">
          <div className="h-full relative">
                <Input
            placeholder={t("walletPlaceholder")}
            value={walletNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              onWalletNumberChange(value);
            }}
            className="h-10 text-[12px] rounded-xl border-slate-200 ps-10"
          />
          <img
            src="/photo/payment/Flag_of_Egypt.svg"
            className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-auto"
            alt="EG"
          />
          </div>
      

           <div>
           {walletNumber && !isValidEgyptPhone && (
             <p className="text-[10px] text-amber-500 ">
               {t("errors.phone_invalid")}
             </p>
           )}
          </div>
        </div>

      
      )}

      {/* CTA Button */}
      <button
        onClick={onCheckout}
        disabled={
          isLoading ||
          !hasItems ||
          (paymentType === "wallet" && !isValidEgyptPhone)
        }
        className="w-full h-12 rounded-2xl bg-cyan-900 hover:bg-cyan-700 text-white text-[11px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {t("processing")}
          </>
        ) : (
          <>
            <Lock size={12} />
            {paymentType === "cash" ? t("btnConfirmCash") : t("btnComplete")}
          </>
        )}
      </button>

      <p className="text-center text-[9px] text-slate-300 uppercase tracking-widest flex items-center justify-center gap-1">
        <Lock size={8} /> {t("securePayTitle")}
      </p>
    </section>
  );
}