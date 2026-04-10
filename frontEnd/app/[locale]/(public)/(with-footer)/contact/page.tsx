"use client";

import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  const t     = useTranslations("contact_page");
  const locale = useLocale();
  const isAr  = locale === "ar";

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="max-w-xl mx-auto px-5 py-14 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-[13px] text-slate-400">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        <a href="mailto:support@gotiy.com"
          className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
            <Mail size={16} className="text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">{t("email_label")}</p>
            <p className="text-[13px] font-medium text-slate-700">support@gotiy.com</p>
          </div>
        </a>

        <a href="tel:+201000000000"
          className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
            <Phone size={16} className="text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">{t("phone_label")}</p>
            <p className="text-[13px] font-medium text-slate-700" dir="ltr">+20 100 000 0000</p>
          </div>
        </a>

        <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
            <Clock size={16} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">{t("hours_label")}</p>
            <p className="text-[13px] font-medium text-slate-700">{t("hours_value")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
