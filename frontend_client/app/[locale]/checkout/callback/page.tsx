"use client";

import React, { Suspense } from "react";
import {
  CheckCircle2, XCircle, Clock, ShieldCheck,
  ArrowRight, RotateCcw, Home, CreditCard,
  Hash, Calendar, Banknote, AlertTriangle,
  Wallet, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function CheckoutCallbackContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const t            = useTranslations("checkout_callback");

  const success      = searchParams.get("success")       === "true";
  const pending      = searchParams.get("pending")       === "true";
  const errorOccured = searchParams.get("error_occured") === "true";

  const txnId        = searchParams.get("id");
  const paymobOrder  = searchParams.get("order");
  const amountCents  = searchParams.get("amount_cents");
  const currency     = searchParams.get("currency") ?? "EGP";
  const createdAt    = searchParams.get("created_at");
  const dataMessage  = searchParams.get("data.message");
  const txnCode      = searchParams.get("txn_response_code");
  const is3dSecure   = searchParams.get("is_3d_secure") === "true";

  // ── Source / payment method ───────────────────────────────
  const sourceType    = searchParams.get("source_data.type");
  const sourcePan     = searchParams.get("source_data.pan");
  const sourceSubType = searchParams.get("source_data.sub_type");

  // ── Derived ───────────────────────────────────────────────
  const amountFormatted = amountCents
    ? (parseInt(amountCents) / 100).toLocaleString("en-EG", { minimumFractionDigits: 2 })
    : "—";

  const dateFormatted = createdAt
    ? new Date(createdAt).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  const isWallet = sourceType?.toLowerCase() === "wallet";

  // ── State config 
  type StateKey = "success" | "pending" | "error";
  const stateKey: StateKey = success && !errorOccured ? "success" : pending ? "pending" : "error";

  const stateConfig = {
    success: {
      icon:  <CheckCircle2 className="w-14 h-14 text-emerald-500 stroke-[1.5]" />,
      ring:  "border-emerald-100 bg-emerald-50/40",
      title: t("success_title"),
      sub:   t("success_sub"),
      badge: { label: t("badge_approved"), cls: "bg-emerald-100 text-emerald-700" },
    },
    pending: {
      icon:  <Clock className="w-14 h-14 text-amber-500 stroke-[1.5]" />,
      ring:  "border-amber-100 bg-amber-50/40",
      title: t("pending_title"),
      sub:   t("pending_sub"),
      badge: { label: t("badge_pending"), cls: "bg-amber-100 text-amber-700" },
    },
    error: {
      icon:  <XCircle className="w-14 h-14 text-rose-500 stroke-[1.5]" />,
      ring:  "border-rose-100 bg-rose-50/40",
      title: t("error_title"),
      sub:   dataMessage && dataMessage.toLowerCase() !== "approved"
             ? dataMessage
             : t("error_sub"),
      badge: { label: txnCode ?? t("badge_declined"), cls: "bg-rose-100 text-rose-700" },
    },
  };

  const cfg = stateConfig[stateKey];

  // ── Detail rows ─
  const details = [
    {
      icon:  <Hash size={11} />,
      label: t("label_txn_id"),
      value: txnId ? `#${txnId}` : "—",
      mono:  true,
    },
    {
      icon:  <Hash size={11} />,
      label: t("label_order_ref"),
      value: paymobOrder ? `#${paymobOrder}` : "—",
      mono:  true,
    },
    {
      icon:  <Banknote size={11} />,
      label: t("label_amount"),
      value: `${amountFormatted} ${currency}`,
      bold:  true,
    },
    {
      icon:  isWallet ? <Wallet size={11} /> : <CreditCard size={11} />,
      label: t("label_method"),
      value: isWallet
        ? t("wallet")
        : sourceSubType && sourcePan
          ? `${sourceSubType} •••• ${sourcePan}`
          : sourceSubType ?? sourceType ?? "—",
    },
    {
      icon:  <Calendar size={11} />,
      label: t("label_date"),
      value: dateFormatted,
    },
    is3dSecure
      ? { icon: <ShieldCheck size={11} />, label: t("label_3ds"), value: t("verified"), green: true }
      : null,
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
    mono?: boolean;
    bold?: boolean;
    green?: boolean;
  }[];

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center justify-center p-6 antialiased font-sans">
      <div className="max-w-sm w-full space-y-6">

        {/* ── Status card ── */}
        <div className={cn("rounded-2xl border p-8 text-center space-y-4", cfg.ring)}>
          <div className="flex justify-center">{cfg.icon}</div>
          <div className="space-y-2">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">{cfg.title}</h1>
            <p className="text-[11px] text-slate-500 leading-relaxed">{cfg.sub}</p>
          </div>
          <span className={cn("inline-block text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full", cfg.badge.cls)}>
            {cfg.badge.label}
          </span>
        </div>

        {/* ── Transaction details ── */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-2">
            <BadgeCheck size={13} className="text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {t("summary_title")}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {details.map((row, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span className="text-slate-300">{row.icon}</span>
                  {row.label}
                </span>
                <span className={cn(
                  "text-[11px] font-semibold text-slate-800",
                  row.mono  && "font-mono text-[10px] text-slate-600",
                  row.bold  && "text-slate-900",
                  row.green && "text-emerald-600"
                )}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Error detail box ── */}
        {stateKey === "error" && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3">
            <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wide">
                {t("error_box_title")}
              </p>
              <p className="text-[11px] text-rose-600 leading-relaxed">
                {dataMessage ?? t("error_bank_declined")}
                {txnCode && txnCode !== "APPROVED" && ` (Code: ${txnCode})`}
              </p>
              <p className="text-[10px] text-rose-400 mt-1">
                {t("error_box_hint")}
              </p>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-col gap-2.5">
          {stateKey === "success" && (
            <Button
              onClick={() => router.push("/orders")}
              className="w-full h-11 rounded-xl text-[11px] font-semibold uppercase tracking-widest"
            >
              {t("btn_track")} <ArrowRight size={13} className="ml-2" />
            </Button>
          )}
          {stateKey === "error" && (
            <Button
              onClick={() => router.back()}
              className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-semibold uppercase tracking-widest"
            >
              {t("btn_retry")} <RotateCcw size={13} className="ml-2" />
            </Button>
          )}
          {stateKey === "pending" && (
            <Button
              onClick={() => router.push("/orders")}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-semibold uppercase tracking-widest"
            >
              {t("btn_view_orders")} <ArrowRight size={13} className="ml-2" />
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full h-11 text-slate-400 hover:text-slate-700 text-[10px] font-semibold uppercase tracking-widest"
          >
            <Home size={12} className="mr-2" /> {t("btn_home")}
          </Button>
        </div>

        {/* ── Security note ── */}
        <div className="flex items-center justify-center gap-2 opacity-40 pb-4">
          <ShieldCheck size={11} className="text-slate-400" />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {t("security_note")}
          </span>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCallbackContent />
    </Suspense>
  );
}
