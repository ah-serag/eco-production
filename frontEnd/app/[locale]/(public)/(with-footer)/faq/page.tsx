"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = ["q1", "q2", "q3", "q4", "q5"] as const;

export default function FaqPage() {
  const t     = useTranslations("faq_page");
  const locale = useLocale();
  const isAr  = locale === "ar";
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="max-w-2xl mx-auto px-5 py-14 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
      <div className="divide-y divide-slate-100">
        {ITEMS.map((key, i) => (
          <div key={key}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-4 text-start gap-4"
            >
              <span className="text-[13px] font-medium text-slate-800">{t(`${key}_q`)}</span>
              <ChevronDown
                size={15}
                className={cn("shrink-0 text-slate-400 transition-transform", open === i && "rotate-180")}
              />
            </button>
            {open === i && (
              <p className="pb-4 text-[12px] text-slate-500 leading-relaxed">{t(`${key}_a`)}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
