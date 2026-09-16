"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";

const PAYMENT_ICONS = [
  { src: "/photo/payment/visa.svg",            alt: "Visa" },
  { src: "/photo/payment/mastercard.svg",       alt: "Mastercard" },
  { src: "/photo/payment/Meeza.svg",            alt: "Meeza" },
  { src: "/photo/payment/Vodafone_cash.svg",    alt: "Vodafone Cash" },
  { src: "/photo/payment/Logo_Orange_Money.svg",alt: "Orange Money" },
  { src: "/photo/payment/Etisalat_eand_Logo_EN.svg",alt: "Etisalat Money" },
];
export default function Footer() {
  const t      = useTranslations("footer");
  const locale = useLocale();
  const isAr   = locale === "ar";
  const year   = new Date().getFullYear();

  return (
    <footer
      dir={isAr ? "rtl" : "ltr"}
      className="mt-auto    bg-primary hidden  sm:block border-t-30 border-neutral-100 pb-20 md:pb-0"
    >
      <div className="max-w-5xl mx-auto px-5 pt-12 pb-6">

        {/* ── Top: logo + cols ── */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">

          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="inline-flex">
              <span className="text-2xl font-serif font-bold tracking-widest uppercase text-white">
                GOTIY
              </span>
            </Link>
            <p className="text-[12px] text-slate-200 leading-relaxed max-w-[220px]">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-2.5">
              <a href="#" aria-label="Instagram"
                className="w-8 h-8 flex bg-white items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:border-slate-400 hover:text-slate-400 transition-all">
                <Instagram  size={14} />
              </a>
              <a href="#" aria-label="Facebook"
                className="w-8 h-8 flex items-center bg-white justify-center rounded-full border border-slate-100 text-slate-600 hover:border-slate-400 hover:text-slate-400 transition-all">
                <Facebook  fillOpacity="blue" size={14} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
            <h4 className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-300">
              {t("links_title")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about",   label: t("about")   },
                { href: "/faq",     label: t("faq")     },
                { href: "/contact", label: t("contact") },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-[12px] text-slate-300 hover:text-slate-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
            <h4 className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-300">
              {t("legal_title")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/privacy",  label: t("privacy")  },
                { href: "/shipping", label: t("shipping") },
                { href: "/returns",  label: t("returns")  },
                { href: "/terms",    label: t("terms")    },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-[12px] text-slate-300 hover:text-slate-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4 flex flex-col gap-3">
            <h4 className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-300">
              {t("contact_title")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href={`mailto:${t("email")}`}
                  className="flex items-center gap-2 text-[12px] text-slate-300 hover:text-slate-400 transition-colors">
                  <Mail size={12} className="shrink-0 text-slate-300" />
                  {t("email")}
                </a>
              </li>
              <li>
                <a href={`tel:${t("phone")}`}
                  className="flex items-center gap-2 text-[12px] text-slate-300 hover:text-slate-400 transition-colors" dir="ltr">
                  <Phone size={12} className="shrink-0 text-slate-300" />
                  {t("phone")}
                </a>
              </li>
            </ul>

            {/* Payment icons */}
            <div className="mt-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-300 mb-2.5">
                {t("payment_title")}
              </p>
              <div className="flex items-center flex-wrap gap-2">
                {PAYMENT_ICONS.map(({ src, alt }) => (
                  <div key={alt}
                    className="h-7 px-1.5  bg-slate-200 rounded flex items-center justify-center">
                    <img src={src} alt={alt} className="h-5 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-5 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-slate-300">
            © {year} GOTIY. {t("rights")}
          </p>
          <p className="text-[10px] text-slate-300">
            {t("made_in")} 🇪🇬
          </p>
        </div>
      </div>
    </footer>
  );
}
