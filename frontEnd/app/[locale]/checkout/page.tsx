"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, MapPin, User, Wallet, Banknote, Truck, ShieldCheck, Lock, Tag, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useCheckoutMutation,
  useCheckoutWalletMutation,
  useCheckoutCashMutation,
} from "@/redux/features/paybom/paybomSlice";
import { useGetBillingDataQuery } from "@/redux/features/checkoutData/checkoutDataSlice";
import { checkoutSchema, type CheckoutFormData } from "@/lib/checkout.schema";
import { useRouter } from "@/i18n/navigation";
import PaymobIframeModal from "@/components/public/PaymobIframeModal";
import { useCheckCouponsMutation } from "@/redux/features/coupons/couponsApiSlice";

const FIELD_CLASS = "h-10 text-[12px] font-normal rounded-xl border-slate-200 focus-visible:ring-slate-300 bg-white";
const AUTO_FILL   = "bg-blue-50/60 border-blue-100";

function Field({
  label, name, value, onChange, placeholder, error, autoFilled, disabled, children,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; error?: string;
  autoFilled?: boolean; disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{label}</Label>
      <div className="relative">
        <Input
          name={name} value={value} onChange={onChange} placeholder={placeholder}
          disabled={disabled}
          className={cn(FIELD_CLASS, children && "ps-10", autoFilled && AUTO_FILL, disabled && "opacity-40 animate-pulse")}
        />
        {children}
      </div>
      {error && <p className="text-[10px] text-red-400 ms-1">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const t   = useTranslations("checkout");
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const dispatch = useDispatch();
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("checkoutItems");
    if (saved) setCheckoutItems(JSON.parse(saved));
  }, []);

  const { data: savedBilling, isLoading: isGettingData, isFetching: isGettingFetching } =
    useGetBillingDataQuery(undefined, { refetchOnMountOrArgChange: true });

  const [checkCoupons, { isLoading: isCheckingCoupon }] = useCheckCouponsMutation();

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const [checkoutCard,   { isLoading: isCardLoading   }] = useCheckoutMutation();
  const [checkoutWallet, { isLoading: isWalletLoading }] = useCheckoutWalletMutation();
  const [checkoutCash,   { isLoading: isCashLoading   }] = useCheckoutCashMutation();

  const [paymentType, setPaymentType] = useState<"card" | "wallet" | "cash">("card");
  const [walletNumber, setWalletNumber] = useState("");
  const [form, setForm] = useState<CheckoutFormData>({
    first_name: "", last_name: "", email: "",
    phone_number: "", city: "", state: "", street: "", building: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Coupon state variables
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discountData, setDiscountData] = useState<{ discountAmount: number; finalTotal: number } | null>(null);

  // General Checkout Error State
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!isGettingData && !isGettingFetching && savedBilling?.first_name) {
      setForm({
        first_name:   savedBilling.first_name   || "",
        last_name:    savedBilling.last_name    || "",
        email:        savedBilling.email        || "",
        phone_number: savedBilling.phone_number || "",
        city:         savedBilling.city         || "",
        state:        savedBilling.state        || "",
        street:       savedBilling.street       || "",
        building:     savedBilling.building     || "",
      });
    }
  }, [savedBilling, isGettingData, isGettingFetching]);

  const totalPrice = checkoutItems.reduce(
    (acc: number, item: any) => acc + Number(item.price) * item.quantity, 0
  );

  const isLoading       = isCardLoading || isWalletLoading || isCashLoading;
  const isFetchingBilling = isGettingData || isGettingFetching;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof CheckoutFormData]) {
      setErrors((p) => { const c = { ...p }; delete c[e.target.name as keyof CheckoutFormData]; return c; });
    }
  }

  async function handleApplyCoupon() {
    setCouponError("");
    if (!couponCode.trim()) return;
     const couponUperrCase = couponCode.toUpperCase()
    try {
      const res = await checkCoupons({ itemscheckout: checkoutItems, couponCode:couponUperrCase }).unwrap();
      setDiscountData({
        discountAmount: res.discountAmount,
        finalTotal: res.finalTotal,
      });
    } catch (err: any) {
      setCouponError(err?.data?.error || "Invalid coupon code");
      setDiscountData(null);
    }
  }

  async function handleCheckout() {
    setCheckoutError(""); // Reset error on new attempt
    if (checkoutItems.length === 0) return;
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.issues.forEach((e: any) => { fe[e.path[0] as keyof CheckoutFormData] = e.message; });
      setErrors(fe);
      return;
    }
    try {
       const couponUperrCase = couponCode.toUpperCase()

      const items = checkoutItems.map((i: any) => ({ id: i.id, quantity: i.quantity }));
      if (paymentType === "card") {
        const res = await checkoutCard({ items, billingData: result.data, couponCode: discountData ? couponUperrCase : undefined }).unwrap();
        setIframeUrl(res.iframeUrl);
      } else if (paymentType === "wallet") {
        if (!walletNumber) {
           setCheckoutError(t("walletError"));
           return;
        }
        const res = await checkoutWallet({ items, billingData: result.data, walletNumber, couponCode: discountData ? couponUperrCase : undefined }).unwrap();
        window.location.href = res.redirectUrl;
      } else {
        const res = await checkoutCash({ items, billingData: result.data, couponCode: discountData ? couponUperrCase : undefined }).unwrap();
        router.push(res.redirectUrl);
      }
    } catch (err: any) {
      if (err.data === "Please try again after 5 minutes.") {
        setCheckoutError(t("limitedReqest"));
      } else {
        const msg = err?.data?.error || "";
        setCheckoutError(msg || (paymentType === "wallet" ? t("walletPaymentFailed") : t("checkoutError")));
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] antialiased" dir={isAr ? "rtl" : "ltr"}>

      {iframeUrl && (
        <PaymobIframeModal url={iframeUrl} onClose={() => setIframeUrl(null)} />
      )}
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT: Forms ── */}
        <div className="lg:col-span-7 space-y-5">

          {/* Contact */}
          <section className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center py-4 gap-2 mb-1">
              <User size={13} className="text-slate-400" />
              <h2 className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">{t("contactTitle")}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t("firstName")} name="first_name" value={form.first_name} onChange={handleChange}
                placeholder={t("firstNamePlaceholder")} error={errors.first_name}
                autoFilled={!!savedBilling?.first_name} disabled={isFetchingBilling} />
              <Field label={t("lastName")} name="last_name" value={form.last_name} onChange={handleChange}
                placeholder={t("lastNamePlaceholder")} error={errors.last_name}
                autoFilled={!!savedBilling?.last_name} disabled={isFetchingBilling} />
            </div>

            <Field label={t("email")} name="email" value={form.email} onChange={handleChange}
              placeholder="you@email.com" error={errors.email}
              autoFilled={!!savedBilling?.email} disabled={isFetchingBilling} />

            <Field label={t("phone")}  name="phone_number" value={form.phone_number} onChange={handleChange}
              placeholder="01000000000" error={errors.phone_number}
              autoFilled={!!savedBilling?.phone_number} disabled={isFetchingBilling}>
              <img src="/photo/payment/Flag_of_Egypt.svg" className="absolute start-3  top-1/2 -translate-y-1/2 h-4 w-auto" alt="EG" />
            </Field>
          </section>

          {/* Shipping */}
          <section className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center py-4 gap-2 mb-1">
              <MapPin size={13} className="text-slate-400" />
              <h2 className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">{t("shippingTitle")}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t("city")} name="city" value={form.city} onChange={handleChange}
                placeholder={t("cityPlaceholder")} error={errors.city}
                autoFilled={!!savedBilling?.city} disabled={isFetchingBilling} />
              <Field label={t("state")} name="state" value={form.state} onChange={handleChange}
                placeholder={t("statePlaceholder")} error={errors.state}
                autoFilled={!!savedBilling?.state} disabled={isFetchingBilling} />
            </div>

            <Field label={t("street")} name="street" value={form.street} onChange={handleChange}
              placeholder={t("streetPlaceholder")} error={errors.street}
              autoFilled={!!savedBilling?.street} disabled={isFetchingBilling} />

            <Field label={t("building")} name="building" value={form.building} onChange={handleChange}
              placeholder={t("buildingPlaceholder")} error={errors.building}
              autoFilled={!!savedBilling?.building} disabled={isFetchingBilling} />
          </section>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Truck,       title: t("freeShippingTitle"), sub: t("freeShippingDesc"), color: "text-blue-500" },
              { icon: ShieldCheck, title: t("securePayTitle"),    sub: t("securePayDesc"),    color: "text-emerald-500" },
            ].map(({ icon: Icon, title, sub, color }) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
                <div className="bg-slate-50 p-2 rounded-lg shrink-0">
                  <Icon size={14} className={color} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-700">{title}</p>
                  <p className="text-[9px] text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Summary + Payment ── */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">

          {/* Order summary */}
          <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{t("summaryTitle")}</h2>
            </div>

            <div className="px-5 divide-y divide-slate-50 max-h-64 overflow-y-auto">
              {checkoutItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 p-1">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-1.5 -end-1.5 w-4 h-4 bg-slate-700 text-white text-[9px] flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="flex-1 text-[12px] font-normal text-slate-700 truncate">{item.title}</p>
                  <p className="text-[12px] font-semibold text-slate-900 shrink-0" dir="ltr">
                    {isAr
                      ? `${t("currency")} ${Math.trunc(Number(item.price) * item.quantity).toLocaleString("en-US")}`
                      : `${Math.trunc(Number(item.price) * item.quantity).toLocaleString("en-US")} ${t("currency")}`
                    }
                  </p>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
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
                  <Tag size={14} className={cn("absolute start-3 top-1/2 -translate-y-1/2", discountData ? "text-emerald-500" : "text-green-400")} />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={isCheckingCoupon || !couponCode || !!discountData}
                  className="h-10 px-5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-[10px] uppercase font-semibold tracking-widest disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center min-w-[80px]"
                >
                  {isCheckingCoupon ? <Loader2 size={14} className="animate-spin" /> : t("apply") || "Apply"}
                </button>
              </div>
              {/* Inline Coupon Error */}
              {couponError && (
                <p className="text-[10px] text-red-500 ms-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {couponError}
                </p>
              )}
              {/* Success Message */}
              {discountData && (
                <p className="text-[10px] text-emerald-600 ms-1 flex items-center gap-1 animate-in fade-in duration-200 font-medium">
                  <ShieldCheck size={12} /> {t("couponApplied") || "Coupon applied successfully"}
                </p>
              )}
            </div>

            {/* Total Section With Discount Display */}
            <div className="px-5 py-4 border-t border-slate-100 space-y-3">
              {discountData && (
                <>
                  <div className="flex justify-between items-center text-[12px] text-slate-500">
                    <span>{t("subtotal") || "Subtotal"}</span>
                    <span dir="ltr">{Math.trunc(Number(totalPrice)).toLocaleString("en-US")} {t("currency")}</span>
                  </div>
                  <div className="flex justify-between items-center text-[12px] text-emerald-600 font-medium">
                    <span>{t("discount") || "Discount"}</span>
                    <span dir="ltr">-{Math.trunc(Number(discountData.discountAmount)).toLocaleString("en-US")} {t("currency")}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">{t("total")}</span>
                <span className="text-[20px] font-semibold text-slate-900 tracking-tight" dir="ltr">
                  {isAr && <span className="text-[11px] font-normal text-slate-400 me-1">{t("currency")}</span>}
                  {Math.trunc(Number(discountData ? discountData.finalTotal : totalPrice)).toLocaleString("en-US")}
                  {!isAr && <span className="text-[11px] font-normal text-slate-400 ms-1">{t("currency")}</span>}
                </span>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{t("paymentMethod")}</h2>

            {/* Method selector */}
            <div className="grid grid-cols-3 gap-2">
              {(["card", "wallet", "cash"] as const).map((method) => {
                const Icon = method === "card" ? CreditCard : method === "wallet" ? Wallet : Banknote;
                const label = t(method);
                return (
                  <button
                    key={method}
                    onClick={() => { setPaymentType(method); setCheckoutError(""); }}
                    className={cn(
                      "h-14 rounded-xl  border flex flex-col items-center justify-center gap-1.5 transition-all duration-200",
                      paymentType === method
                        ? " bg-cyan-900 text-neutral-100 "
                        : "border-slate-200 text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <Icon size={15} />
                    <span className="text-[9px] uppercase tracking-widest font-medium">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Error display under payment selector */}
            {checkoutError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle size={14} className="shrink-0" />
                <p className="text-[10px] font-medium leading-tight">{checkoutError}</p>
              </div>
            )}

            {/* Payment logos */}
            <div className="flex items-center justify-center gap-3 py-1">
              {paymentType === "cash" ? (
                <span className="text-[10px] text-slate-400 italic">{t("cashInfo")}</span>
              ) : paymentType === "card" ? (
                <>
                  <img src="/photo/payment/visa.svg"       className="h-3.5 w-auto opacity-30" alt="visa" />
                  <img src="/photo/payment/mastercard.svg" className="h-5 w-auto opacity-30"   alt="mastercard" />
                  <img src="/photo/payment/Meeza.svg"      className="h-3.5 w-auto opacity-30" alt="meeza" />
                </>
              ) : (
                <>
                  <img src="/photo/payment/Vodafone_cash.svg"           className="h-7 w-auto opacity-30" alt="vodafone" />
                  <img src="/photo/payment/Logo_Orange_Money.svg"        className="h-4 w-auto opacity-30" alt="orange" />
                  <img src="/photo/payment/Etisalat_eand_Logo_EN.svg"    className="h-3.5 w-auto opacity-30" alt="etisalat" />
                </>
              )}
            </div>

            {/* Wallet number */}
            {paymentType === "wallet" && (
              <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                <Input
                  placeholder={t("walletPlaceholder")}
                  value={walletNumber}
                  onChange={(e) => { setWalletNumber(e.target.value); setCheckoutError(""); }}
                  className="h-10 text-[12px] rounded-xl border-slate-200 ps-10"
                />
                <img src="/photo/payment/Flag_of_Egypt.svg" className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-auto" alt="EG" />
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleCheckout}
              disabled={isLoading || checkoutItems.length === 0}
              className="w-full h-12  rounded-2xl  bg-cyan-900 hover:bg-cyan-700 text-white text-[11px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" />{t("processing")}</>
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

        </div>
      </div>
    </div>
  );
}