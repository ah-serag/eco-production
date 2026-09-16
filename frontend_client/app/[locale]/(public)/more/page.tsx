"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Info, HelpCircle, Phone, ShieldCheck,
  Truck, RotateCcw, FileText, ChevronRight, ChevronLeft,
} from "lucide-react";

const PAYMENT_ICONS = [
  { src: "/photo/payment/visa.svg",             alt: "Visa" },
  { src: "/photo/payment/mastercard.svg",        alt: "Mastercard" },
  { src: "/photo/payment/Meeza.svg",             alt: "Meeza" },
  { src: "/photo/payment/Vodafone_cash.svg",     alt: "Vodafone Cash" },
  { src: "/photo/payment/Logo_Orange_Money.svg", alt: "Orange Money" },
   { src: "/photo/payment/Etisalat_eand_Logo_EN.svg",alt: "Etisalat Money" },
];

function Row({ href, icon: Icon, label, isAr }: { href: string; icon: any; label: string; isAr: boolean }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-3.5 active:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-slate-500" />
        </div>
        <span className="text-[13px] font-medium text-slate-700">{label}</span>
      </div>
      {isAr ? <ChevronLeft size={14} className="text-slate-300" /> : <ChevronRight size={14} className="text-slate-300" />}
    </Link>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="px-4 pt-5 pb-1.5 text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400">
      {title}
    </p>
  );
}

export default function MorePage() {
  const t    = useTranslations("more_page");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#F9FAFB] pb-24">

      {/* ── Brand header ── */}
      <div className="bg-white px-5 pt-10 pb-6 border-b border-slate-100">
        <span className="text-2xl font-serif font-bold tracking-widest uppercase text-primary">
          GOTIY
        </span>
        <p className="mt-1 text-[11px] text-slate-400 tracking-wide">{t("tagline")}</p>
      </div>

      {/* ── Explore ── */}
      <div className="mt-3 bg-white rounded-2xl mx-3 overflow-hidden divide-y divide-slate-50">
        <SectionTitle title={t("explore")} />
        <Row href="/about"   icon={Info}        label={t("about")}   isAr={isAr} />
        <Row href="/faq"     icon={HelpCircle}  label={t("faq")}     isAr={isAr} />
        <Row href="/contact" icon={Phone}       label={t("contact")} isAr={isAr} />
      </div>

      {/* ── Legal ── */}
      <div className="mt-3 bg-white rounded-2xl mx-3 overflow-hidden divide-y divide-slate-50">
        <SectionTitle title={t("legal")} />
        <Row href="/privacy"  icon={ShieldCheck} label={t("privacy")}  isAr={isAr} />
        <Row href="/shipping" icon={Truck}        label={t("shipping")} isAr={isAr} />
        <Row href="/returns"  icon={RotateCcw}    label={t("returns")}  isAr={isAr} />
        <Row href="/terms"    icon={FileText}     label={t("terms")}    isAr={isAr} />
      </div>

      {/* ── Payment methods ── */}
      <div className="mt-3 bg-white rounded-2xl mx-3 px-4 py-4">
        <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-3">
          {t("payment_title")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_ICONS.map(({ src, alt }) => (
            <div key={alt} className="h-7 px-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
              <img src={src} alt={alt} className="h-4 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer note ── */}
      <p className="text-center text-[10px] text-slate-300 mt-6 px-4">
        {t("rights")}
      </p>
    </div>
  );
}
