"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl"; // إضافة الترجمة
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, MapPin, User, Wallet, Banknote } from "lucide-react";
import { 
  useCheckoutMutation, 
  useCheckoutWalletMutation,
  useCheckoutCashMutation 
} from "@/redux/features/paybom/paybomSlice";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/checkout.schema";

export default function CheckoutPage() {
  const t = useTranslations("checkout"); // استخدام الترجمة
  const checkoutItems = useSelector((state: any) => state.cart.checkoutItems);
  const router = useRouter();
  const checkout_url = usePathname();

  const [checkoutCard, { isLoading: isCardLoading }] = useCheckoutMutation();
  const [checkoutWallet, { isLoading: isWalletLoading }] = useCheckoutWalletMutation();
  const [checkoutCash, { isLoading: isCashLoading }] = useCheckoutCashMutation();

  const [paymentType, setPaymentType] = useState<"card" | "wallet" | "cash">("card");
  const [walletNumber, setWalletNumber] = useState("");

  const [form, setForm] = useState<CheckoutFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    city: "",
    state: "",
    street: "",
    building: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const totalPrice = checkoutItems.reduce(
    (acc: number, item: any) => acc + Number(item.price) * item.quantity,
    0
  );

  const isLoading = isCardLoading || isWalletLoading || isCashLoading;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof CheckoutFormData]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name as keyof CheckoutFormData];
        return copy;
      });
    }
  }

  async function handleCheckout() {
    if (checkoutItems.length === 0) return;
    const result = checkoutSchema.safeParse(form);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error?.issues.forEach((err: any) => {
        const field = err.path[0] as keyof CheckoutFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const itemsPayload = checkoutItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      if (paymentType === "card") {
        const res = await checkoutCard({ items: itemsPayload, billingData: result.data }).unwrap();
        window.location.href = res.iframeUrl;
      } else if (paymentType === "wallet") {
        if (!walletNumber) return alert(t("walletError"));
        const res = await checkoutWallet({ 
          items: itemsPayload, 
          billingData: result.data, 
          walletNumber 
        }).unwrap();
        window.location.href = res.redirectUrl;
      } else {
        const res = await checkoutCash({ items: itemsPayload, billingData: result.data }).unwrap();
        router.push(res.redirectUrl);
      }
    } catch (err: any) {
      if (err.status === 403) {
        router.push(`/auth/sign_in?checkout_url=${checkout_url}`);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 antialiased">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-7 space-y-6">
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-md font-medium text-slate-800">
                <User size={16} className="text-slate-400" />
                {t("contactTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("firstName")}</Label>
                  <Input name="first_name" value={form.first_name} onChange={handleChange} className="h-10 text-sm" placeholder={t("firstNamePlaceholder")} />
                  {errors.first_name && <p className="text-[10px] text-red-500 ml-1">{errors.first_name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("lastName")}</Label>
                  <Input name="last_name" value={form.last_name} onChange={handleChange} className="h-10 text-sm" placeholder={t("lastNamePlaceholder")} />
                  {errors.last_name && <p className="text-[10px] text-red-500 ml-1">{errors.last_name}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("email")}</Label>
                <Input name="email" value={form.email} onChange={handleChange} className="h-10 text-sm" placeholder="you@email.com" />
                {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("phone")}</Label>
                <div className="relative">
                  <Input name="phone_number" value={form.phone_number} onChange={handleChange} className="h-10 text-sm pl-10" placeholder="01000000000" />
                  <img src="/photo/payment/Flag_of_Egypt.svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-auto" alt="EG" />
                </div>
                {errors.phone_number && <p className="text-[10px] text-red-500 ml-1">{errors.phone_number}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-md font-medium text-slate-800">
                <MapPin size={16} className="text-slate-400" />
                {t("shippingTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("city")}</Label>
                  <Input name="city" value={form.city} onChange={handleChange} className="h-10 text-sm" placeholder={t("cityPlaceholder")} />
                  {errors.city && <p className="text-[10px] text-red-500 ml-1">{errors.city}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("state")}</Label>
                  <Input name="state" value={form.state} onChange={handleChange} className="h-10 text-sm" placeholder={t("statePlaceholder")} />
                  {errors.state && <p className="text-[10px] text-red-500 ml-1">{errors.state}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("street")}</Label>
                <Input name="street" value={form.street} onChange={handleChange} className="h-10 text-sm" placeholder={t("streetPlaceholder")} />
                {errors.street && <p className="text-[10px] text-red-500 ml-1">{errors.street}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">{t("building")}</Label>
                <Input name="building" value={form.building} onChange={handleChange} className="h-10 text-sm" placeholder={t("buildingPlaceholder")} />
                {errors.building && <p className="text-[10px] text-red-500 ml-1">{errors.building}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border border-slate-100 shadow-sm sticky top-6 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500">{t("summaryTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {checkoutItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pt-4 items-center">
                    <div className="relative w-14 h-14 bg-white border border-slate-100 rounded-lg p-1">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center rounded-full font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-medium text-slate-800 truncate">{item.title}</h3>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <Label className="text-[10px] font-semibold uppercase text-slate-400">{t("paymentMethod")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPaymentType("card")}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentType === "card" ? "border-chart-1 bg-chart-1/5 text-chart-1" : "border-slate-100 text-slate-500 hover:bg-slate-50"}`}
                  >
                    <CreditCard size={14} />
                    <span className="text-[9px] font-semibold uppercase tracking-tighter">{t("card")}</span>
                  </button>
                  <button 
                    onClick={() => setPaymentType("wallet")}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentType === "wallet" ? "border-chart-1 bg-chart-1/5 text-chart-1" : "border-slate-100 text-slate-500 hover:bg-slate-50"}`}
                  >
                    <Wallet size={14} />
                    <span className="text-[9px] font-semibold uppercase tracking-tighter">{t("wallet")}</span>
                  </button>
                  <button 
                    onClick={() => setPaymentType("cash")}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentType === "cash" ? "border-chart-1 bg-chart-1/5 text-chart-1" : "border-slate-100 text-slate-500 hover:bg-slate-50"}`}
                  >
                    <Banknote size={14} />
                    <span className="text-[9px] font-semibold uppercase tracking-tighter">{t("cash")}</span>
                  </button>
                </div>

                <div className="py-1 min-h-5 flex items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                  {paymentType === "cash" ? (
                     <span className="text-[10px] text-slate-400 font-medium italic">{t("cashInfo")}</span>
                  ) : (
                    <>
                      <span className="text-[10px] text-slate-300 font-medium">{t("supported")}:</span>
                      {paymentType === "card" ? (
                        <>
                          <img src="/photo/payment/visa.svg" className="h-3 w-auto opacity-10 grayscale" alt="visa" />
                          <img src="/photo/payment/mastercard.svg" className="h-4 w-auto opacity-10 grayscale" alt="mastercard" />
                          <img src="/photo/payment/Meeza.svg" className="h-3 w-auto opacity-10 grayscale" alt="meeza" />
                        </>
                      ) : (
                        <>
                          <img src="/photo/payment/Vodafone_cash.svg" className="h-4 w-auto opacity-10 grayscale" alt="vodafone" />
                          <img src="/photo/payment/Logo_Orange_Money.svg" className="h-4 w-auto opacity-10 grayscale" alt="orange" />
                          <img src="/photo/payment/Etisalat_eand_Logo_EN.svg" className="h-3 w-auto opacity-10 grayscale" alt="etisalat" />
                        </>
                      )}
                    </>
                  )}
                </div>

                {paymentType === "wallet" && (
                  <div className="animate-in fade-in slide-in-from-top-1 relative">
                    <Input 
                      placeholder={t("walletPlaceholder")} 
                      value={walletNumber}
                      onChange={(e) => setWalletNumber(e.target.value)}
                      className="h-9 text-[11px] border-chart-1/20 focus-visible:ring-chart-1 pl-10"
                    />
                    <img src="/photo/payment/Flag_of_Egypt.svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-auto " alt="EG" />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-slate-900 uppercase">{t("total")}</span>
                  <span className="text-lg font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || checkoutItems.length === 0}
                  className="w-full h-11 rounded-xl font-semibold bg-chart-1 hover:brightness-110 text-white transition-all text-[11px] tracking-widest flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={16} /> {t("processing")}</>
                  ) : (
                    <>
                      {paymentType === "cash" ? <Banknote size={16} /> : <CreditCard size={16} />}
                      {paymentType === "cash" ? t("btnConfirmCash") : t("btnComplete")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}