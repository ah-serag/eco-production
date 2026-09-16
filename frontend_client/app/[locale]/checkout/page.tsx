"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import {
  useCheckoutMutation,
  useCheckoutWalletMutation,
  useCheckoutCashMutation,
} from "@/redux/features/paybom/paybomSlice";
import { useGetBillingDataQuery } from "@/redux/features/checkoutData/checkoutDataSlice";
import { getBillingSchema, type billingSchemaFormData } from "@/lib/checkout.schema";

import PaymobIframeModal from "@/components/public/PaymobIframeModal";
import ContactSection  from "./components/ContactSection";
import ShippingSection from "./components/ShippingSection";
import TrustBadges     from "./components/TrustBadges";
import OrderSummary    from "./components/OrderSummary";
import PaymentSection  from "./components/PaymentSection";

type PaymentType = "card" | "wallet" | "cash";

export default function CheckoutPage() {
  const t      = useTranslations("checkout");
  const locale = useLocale();
  const isAr   = locale === "ar";
  const router = useRouter();
  const dispatch = useDispatch();

  const billingSchema = getBillingSchema(t);

  // ── Checkout items ──────────────────────────────────────────────────────────
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("checkoutItems");
    if (saved) setCheckoutItems(JSON.parse(saved));
  }, []);

  // ── Billing data (pre-fill) ─────────────────────────────────────────────────
  const {
    data: savedBilling,
    isLoading: isGettingData,
    isFetching: isGettingFetching,
  } = useGetBillingDataQuery(undefined, { refetchOnMountOrArgChange: true });

  const isFetchingBilling = isGettingData || isGettingFetching;

  // ── Mutations ───────────────────────────────────────────────────────────────
  const [checkoutCard,   { isLoading: isCardLoading   }] = useCheckoutMutation();
  const [checkoutWallet, { isLoading: isWalletLoading }] = useCheckoutWalletMutation();
  const [checkoutCash,   { isLoading: isCashLoading   }] = useCheckoutCashMutation();

  const isLoading = isCardLoading || isWalletLoading || isCashLoading;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState<billingSchemaFormData>({
    first_name: "", last_name: "", email: "",
    phone_number: "", city: "", state: "", street: "", building: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof billingSchemaFormData, string>>>({});

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof billingSchemaFormData]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name as keyof billingSchemaFormData];
        return copy;
      });
    }
  }

  // ── Payment state ───────────────────────────────────────────────────────────
  const [paymentType,   setPaymentType]   = useState<PaymentType>("card");
  const [walletNumber,  setWalletNumber]  = useState("");
  const [iframeUrl,     setIframeUrl]     = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  // ── Coupon / discount state ─────────────────────────────────────────────────
  const [discountData, setDiscountData] = useState<{
    discountAmount: number;
    finalTotal: number;
  } | null>(null);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const totalPrice = checkoutItems.reduce(
    (acc: number, item: any) => acc + Number(item.price) * item.quantity,
    0
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handlePaymentTypeChange(type: PaymentType) {
    setPaymentType(type);
    setCheckoutError("");
  }

  function handleWalletNumberChange(value: string) {
    setWalletNumber(value);
    setCheckoutError("");
  }

  async function handleCheckout() {
    setCheckoutError("");
    if (checkoutItems.length === 0) return;

    const result = billingSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof billingSchemaFormData, string>> = {};
      result.error.issues.forEach((e: any) => {
        fe[e.path[0] as keyof billingSchemaFormData] = e.message;
      });
      setErrors(fe);
      return;
    }

    try {
      const couponUpperCase = discountData
        ? (localStorage.getItem("lastCouponCode") || "").toUpperCase()
        : undefined;

      const items = checkoutItems.map((i: any) => ({ id: i.id, quantity: i.quantity }));

      if (paymentType === "card") {
        const res = await checkoutCard({
          items,
          billingData: result.data,
          couponCode: couponUpperCase,
        }).unwrap();
        setIframeUrl(res.iframeUrl);

      } else if (paymentType === "wallet") {
        if (!walletNumber) {
          setCheckoutError(t("walletError"));
          return;
        }
        const res = await checkoutWallet({
          items,
          billingData: result.data,
          walletNumber,
          couponCode: couponUpperCase,
        }).unwrap();
        window.location.href = res.redirectUrl;

      } else {
        const res = await checkoutCash({
          items,
          billingData: result.data,
          couponCode: couponUpperCase,
        }).unwrap();
        router.push(res.redirectUrl);
      }
    } catch (err: any) {
      if (err.data === "Please try again after 5 minutes.") {
        setCheckoutError(t("limitedReqest"));
      } else {
        const msg = err?.data?.error || "";
        setCheckoutError(
          msg ||
            (paymentType === "wallet" ? t("walletPaymentFailed") : t("checkoutError"))
        );
      }
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F9FAFB] antialiased" dir={isAr ? "rtl" : "ltr"}>
      {iframeUrl && (
        <PaymobIframeModal url={iframeUrl} onClose={() => setIframeUrl(null)} />
      )}

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT: Forms ── */}
        <div className="lg:col-span-7 space-y-5">
          <ContactSection
            form={form}
            errors={errors}
            savedBilling={savedBilling}
            isFetchingBilling={isFetchingBilling}
            onChange={handleChange}
          />

          <ShippingSection
            form={form}
            errors={errors}
            savedBilling={savedBilling}
            isFetchingBilling={isFetchingBilling}
            onChange={handleChange}
          />

          <TrustBadges />
        </div>

        {/* ── RIGHT: Summary + Payment ── */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <OrderSummary
            checkoutItems={checkoutItems}
            totalPrice={totalPrice}
            discountData={discountData}
            onDiscountApplied={setDiscountData}
          />

          <PaymentSection
            paymentType={paymentType}
            walletNumber={walletNumber}
            isLoading={isLoading}
            checkoutError={checkoutError}
            hasItems={checkoutItems.length > 0}
            onPaymentTypeChange={handlePaymentTypeChange}
            onWalletNumberChange={handleWalletNumberChange}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
