"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, ShoppingBag, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col items-center justify-center p-6 antialiased font-sans">
      
  

      <div className="max-w-sm w-full text-center space-y-10">
        
        {/* Status Icon & Message */}
        <div className="space-y-4">
          <div className="flex justify-center">
            {success ? (
              <CheckCircle2 className="w-16 h-16 text-emerald-500 stroke-[1.5]" />
            ) : (
              <XCircle className="w-16 h-16 text-rose-500 stroke-[1.5]" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {success ? "Payment Successful" : "Payment Declined"}
            </h1>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
              {success 
                ? "Your order has been confirmed and is now being processed" 
                : "The transaction was unsuccessful. Please try again or use another method"}
            </p>
          </div>
        </div>

        {/* Order Details Mini Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-tight">
            <span className="text-slate-400">Order Reference</span>
            <span className="text-slate-900 font-mono tracking-tighter">#{orderId?.split('-')[0] || "N/A"}</span>
          </div>
          <div className="h-px bg-slate-50 w-full" />
          <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-tight">
            <span className="text-slate-400">Transaction Status</span>
            <span className={success ? "text-emerald-600" : "text-rose-600"}>
              {success ? "Authorized" : "Failed"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {success ? (
            <Button 
              onClick={() => router.push("/orders")}
              className="w-full h-11 bg-chart-1 hover:opacity-90 text-white rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all"
            >
              Track Order <ArrowRight size={14} className="ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={() => router.push("/checkout")}
              className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all"
            >
              Try Again <RotateCcw size={14} className="ml-2" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")}
            className="w-full h-11 text-slate-400 hover:text-slate-900 text-[10px] font-semibold uppercase tracking-widest"
          >
            Return to Home
          </Button>
        </div>

        {/* Footer Security */}
        <div className="pt-8 flex items-center justify-center gap-2 opacity-40">
           <ShieldCheck size={12} className="text-slate-400" />
           <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
             Vexa Secure Checkout
           </span>
        </div>
      </div>
    </div>
  );
}