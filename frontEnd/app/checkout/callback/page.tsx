"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, XCircle, ShoppingBag, 
  ArrowRight, CreditCard, RefreshCcw, ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
// افترضت هنا اسم الـ action الخاص بتنظيف السلة عندك
// import { clearCart } from "@/redux/features/cart/cartSlice";
// import { useAppDispatch } from "@/redux/hooks";

export default function CheckoutCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const dispatch = useAppDispatch();
  
  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (success) {
      // هنا نقوم بتنظيف السلة بمجرد التأكد من النجاح
      // dispatch(clearCart());
      console.log("Cart cleared successfully");
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* الـ Logo الخاص بـ Vexa */}
      <div className="flex items-center gap-2 mb-8">
         <div className="w-8 h-8 bg-chart-1 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
         </div>
         <span className="text-xl font-black tracking-tighter text-slate-900">Vexa <span className="text-chart-1">Admin</span></span>
      </div>

      <Card className="max-w-md w-full border-none shadow-2xl overflow-hidden bg-white">
        {/* Header الحالة */}
        <div className={cn(
          "h-32 flex items-center justify-center relative transition-colors duration-500",
          success ? "bg-emerald-500" : "bg-rose-500"
        )}>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="bg-white rounded-full p-4 shadow-xl scale-110">
            {success ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-in zoom-in duration-300" />
            ) : (
              <XCircle className="w-12 h-12 text-rose-500 animate-in zoom-in duration-300" />
            )}
          </div>
        </div>

        <CardContent className="pt-12 pb-8 px-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {success ? "Payment Confirmed!" : "Transaction Failed"}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed px-2">
              {success 
                ? "Great news! Your payment was processed successfully. We've sent a confirmation email to your inbox." 
                : "We couldn't process your payment. This could be due to insufficient funds or a temporary bank issue."}
            </p>
          </div>

          {/* معلومات الطلب */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
              <span className="text-slate-400">Order ID</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">#{orderId || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider border-t border-slate-200/60 pt-3">
              <span className="text-slate-400">Status</span>
              <span className={success ? "text-emerald-600" : "text-rose-600"}>
                {success ? "Paid & Secured" : "Declined"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {success ? (
              <>
                <Button 
                  onClick={() => router.push("/account/orders")}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all"
                >
                  View My Orders
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                  className="w-full h-12 border-slate-200 text-slate-600 font-bold rounded-xl"
                >
                  Back to Shop
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => router.push("/checkout")}
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all"
                >
                  Try Different Card
                  <RefreshCcw className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push("/")}
                  className="w-full text-slate-500 font-medium"
                >
                  Cancel and Return
                </Button>
              </>
            )}
          </div>
        </CardContent>

        {/* فوتر الأمان */}
        <div className="bg-slate-50/80 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
            Vexa Secure Transaction
          </span>
        </div>
      </Card>
    </div>
  );
}