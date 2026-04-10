"use client";

import { useEffect, useState } from "react";
import { X, Lock, ShieldCheck } from "lucide-react";

interface Props {
  url: string;
  onClose: () => void;
}

export default function PaymobIframeModal({ url, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
      // تم إزالة onClose من هنا لضمان عدم الإغلاق عند النقر على الخلفية السوداء
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100dvh - 48px)" }}
        // منع انتشار النقرات من داخل المودال إلى الخلفية (للاحتياط)
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <Lock size={12} className="text-white" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-slate-800 leading-tight">
                Secure Payment
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Powered by Paymob
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck size={13} />
              <span className="text-[10px] font-medium">SSL Encrypted</span>
            </div>
            {/* الزر الوحيد المسؤول عن الإغلاق */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Iframe ── */}
        <div className="relative flex-1 min-h-0">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin" />
              <p className="text-[11px] uppercase tracking-widest text-slate-400">
                Loading payment gateway…
              </p>
            </div>
          )}
          <iframe
            src={url}
            onLoad={() => setLoaded(true)}
            className="w-full h-full border-0"
            style={{ minHeight: "520px" }}
            title="Paymob Secure Payment"
            allow="payment"
          />
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-2.5 border-t border-slate-50 shrink-0 flex items-center justify-center gap-1.5">
          <Lock size={10} className="text-slate-300" />
          <p className="text-[9px] uppercase tracking-widest text-slate-300">
            Your payment info is safe and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}