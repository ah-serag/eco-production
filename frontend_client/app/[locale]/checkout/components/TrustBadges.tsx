"use client";

import { Truck, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TrustBadges() {
  const t = useTranslations("checkout");

  const badges = [
    {
      icon: Truck,
      title: t("freeShippingTitle"),
      sub: t("freeShippingDesc"),
      color: "text-blue-500",
    },
    {
      icon: ShieldCheck,
      title: t("securePayTitle"),
      sub: t("securePayDesc"),
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map(({ icon: Icon, title, sub, color }) => (
        <div
          key={title}
          className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white"
        >
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
  );
}
