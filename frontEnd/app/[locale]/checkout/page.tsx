"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, MapPin, User, Wallet, Banknote, Truck, ShieldCheck } from "lucide-react";
import { 
  useCheckoutMutation, 
  useCheckoutWalletMutation,
  useCheckoutCashMutation 
} from "@/redux/features/paybom/paybomSlice";
import { useGetBillingDataQuery } from "@/redux/features/checkoutData/checkoutDataSlice"; 
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/checkout.schema";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function CheckoutPage() {
  const t = useTranslations("checkout"); 
  const checkoutItems = useSelector((state: any) => state.cart.checkoutItems);
  const router = useRouter();

  // 1. جلب بيانات الفوترة المسجلة
  const { data: savedBillingData, isLoading: isGettingData } = useGetBillingDataQuery(undefined);

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

  // 2. تعبئة النموذج تلقائيًا
  useEffect(() => {
    if (savedBillingData) {
      setForm({
        first_name: savedBillingData.first_name || "",
        last_name: savedBillingData.last_name || "",
        email: savedBillingData.email || "",
        phone_number: savedBillingData.phone_number || "",
        city: savedBillingData.city || "",
        state: savedBillingData.state || "",
        street: savedBillingData.street || "",
        building: savedBillingData.building || "",
      });
    }
  }, [savedBillingData]);

  const totalPrice = checkoutItems.reduce(
    (acc: number, item: any) => acc + Number(item.price) * item.quantity,
    0
  );

  const isLoading = isCardLoading || isWalletLoading || isCashLoading;

  const autoFillStyle = "bg-blue-50 transition-all duration-500";

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
       console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-2 antialiased">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* القسم الأيسر: بيانات المستخدم والشحن */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border rounded-none border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-md font-normal text-slate-800">
                <User size={16} className="text-slate-400" />
                {t("contactTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("firstName")}</Label>
                  <Input 
                    name="first_name" 
                    value={form.first_name} 
                    onChange={handleChange} 
                    className={`h-10 text-sm font-normal ${savedBillingData?.first_name ? autoFillStyle : ""}`} 
                    placeholder={t("firstNamePlaceholder")} 
                  />
                  {errors.first_name && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.first_name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("lastName")}</Label>
                  <Input 
                    name="last_name" 
                    value={form.last_name} 
                    onChange={handleChange} 
                    className={`h-10 text-sm font-normal ${savedBillingData?.last_name ? autoFillStyle : ""}`} 
                    placeholder={t("lastNamePlaceholder")} 
                  />
                  {errors.last_name && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.last_name}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("email")}</Label>
                <Input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className={`h-10 text-sm font-normal ${savedBillingData?.email ? autoFillStyle : ""}`} 
                  placeholder="you@email.com" 
                />
                {errors.email && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("phone")}</Label>
                <div className="relative">
                  <Input 
                    name="phone_number" 
                    value={form.phone_number} 
                    onChange={handleChange} 
                    className={`h-10 text-sm pl-10 font-normal ${savedBillingData?.phone_number ? autoFillStyle : ""}`} 
                    placeholder="01000000000" 
                  />
                  <img src="/photo/payment/Flag_of_Egypt.svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-auto" alt="EG" />
                </div>
                {errors.phone_number && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.phone_number}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border rounded-none border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-md font-normal text-slate-800">
                <MapPin size={16} className="text-slate-400" />
                {t("shippingTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("city")}</Label>
                  <Input 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    className={`h-10 text-sm font-normal ${savedBillingData?.city ? autoFillStyle : ""}`} 
                    placeholder={t("cityPlaceholder")} 
                  />
                  {errors.city && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.city}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("state")}</Label>
                  <Input 
                    name="state" 
                    value={form.state} 
                    onChange={handleChange} 
                    className={`h-10 text-sm font-normal ${savedBillingData?.state ? autoFillStyle : ""}`} 
                    placeholder={t("statePlaceholder")} 
                  />
                  {errors.state && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.state}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("street")}</Label>
                <Input 
                  name="street" 
                  value={form.street} 
                  onChange={handleChange} 
                  className={`h-10 text-sm font-normal ${savedBillingData?.street ? autoFillStyle : ""}`} 
                  placeholder={t("streetPlaceholder")} 
                />
                {errors.street && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.street}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-normal">{t("building")}</Label>
                <Input 
                  name="building" 
                  value={form.building} 
                  onChange={handleChange} 
                  className={`h-10 text-sm font-normal ${savedBillingData?.building ? autoFillStyle : ""}`} 
                  placeholder={t("buildingPlaceholder")} 
                />
                {errors.building && <p className="text-[10px] text-red-500 ml-1 font-normal">{errors.building}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* القسم الأيمن: ملخص الطلب والدفع */}
        <div className="lg:col-span-5 rounded-none space-y-4">
          <Card className="border border-slate-100 shadow-sm sticky top-6 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500">{t("summaryTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {checkoutItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pt-4 items-center border-b border-slate-50 pb-4 last:border-0">
                    <div className="relative w-14 h-14 bg-white border border-slate-100 rounded-lg p-1">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center rounded-full font-normal">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-normal text-slate-800 truncate">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{(Number(item.price) * item.quantity).toFixed(2)} {t("currency")}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- قسم حوافز الشراء المتجاوب مع الترجمة --- */}
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
               <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex-1">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                     <Truck size={14} className="text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[10.5px] font-bold text-slate-700 truncate">{t("freeShippingTitle")}</span>
                     <span className="text-[9px] text-slate-400 truncate">{t("freeShippingDesc")}</span>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex-1">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                     <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[10.5px] font-bold text-slate-700 truncate">{t("securePayTitle")}</span>
                     <span className="text-[9px] text-slate-400 truncate">{t("securePayDesc")}</span>
                  </div>
               </div>
            </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <Label className="text-[10px] font-normal uppercase text-slate-400">{t("paymentMethod")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPaymentType("card")}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentType === "card" ? "border-gray-200 bg-primary/5 text-slate-700" : "border-slate-100 text-slate-500 hover:bg-slate-50"}`}
                  >
                    <CreditCard size={14} />
                    <span className="text-[9px] font-normal uppercase tracking-tighter">{t("card")}</span>
                  </button>
                  <button 
                    onClick={() => setPaymentType("wallet")}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentType === "wallet" ? "border-gray-200 bg-primary/5 text-slate-700" : "border-slate-100 text-slate-500 hover:bg-slate-50"}`}
                  >
                    <Wallet size={14} />
                    <span className="text-[9px] font-normal uppercase tracking-tighter">{t("wallet")}</span>
                  </button>
                  <button 
                    onClick={() => setPaymentType("cash")}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${paymentType === "cash" ? "border-gray-200 bg-primary/5 text-slate-700" : "border-slate-100 text-slate-500 hover:bg-slate-50"}`}
                  >
                    <Banknote size={14} />
                    <span className="text-[9px] font-normal uppercase tracking-tighter">{t("cash")}</span>
                  </button>
                </div>

                <div className="py-1 min-h-5 flex items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                  {paymentType === "cash" ? (
                      <span className="text-[10px] text-slate-400 font-normal italic">{t("cashInfo")}</span>
                  ) : (
                    <>
                      <span className="text-[10px] text-slate-300 font-normal">{t("supported")}:</span>
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
                      className="h-9 text-[11px] border-primary/20 focus-visible:ring-primary pl-10 font-normal"
                    />
                    <img src="/photo/payment/Flag_of_Egypt.svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-auto" alt="EG" />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-slate-900 uppercase">{t("total")}</span>
                  <span className="text-lg font-semibold text-slate-900">{totalPrice.toFixed(2)} {t("currency")}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || checkoutItems.length === 0}
                  className="w-full h-11 rounded-xl font-semibold bg-primary hover:brightness-110 text-white transition-all text-[11px] tracking-widest flex items-center justify-center gap-2 shadow-none"
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