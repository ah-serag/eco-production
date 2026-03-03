"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Package, Truck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "---";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 antialiased">
      <Card className="max-w-md w-full rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white overflow-hidden">
        <CardContent className="pt-12 pb-10 px-8 text-center">
          
          {/* Success Icon Section */}
          <div className="relative mx-auto w-20 h-20 mb-8">
            <div className="flex items-center justify-center w-full h-full bg-chart-1/5 rounded-full border border-chart-1/10">
              <CheckCircle2 size={40} className="text-chart-1" strokeWidth={1.5} />
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
            Order Confirmed
          </h1>
          <p className="text-[13px] text-slate-500 mb-8 leading-relaxed px-4">
            Thank you for your purchase. Your order <span className="text-slate-900 font-semibold">#{orderId}</span> has been received and is now being prepared.
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-50 flex flex-col items-center">
              <Package size={15} className="text-slate-400 mb-2" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</span>
              <span className="text-[11px] font-semibold text-slate-700 mt-1">Confirmed</span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-50 flex flex-col items-center">
              <Calendar size={15} className="text-slate-400 mb-2" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Expected</span>
              <span className="text-[11px] font-semibold text-slate-700 mt-1">2-3 Days</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/orders" className="block">
              <Button className="w-full h-12 rounded-2xl font-semibold bg-chart-1 hover:bg-chart-1/80 text-white text-[11px] tracking-widest shadow-lg shadow-slate-100 gap-2 transition-all group">
                TRACK YOUR ORDER
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full h-12 rounded-2xl font-semibold text-slate-400 hover:text-slate-900 hover:bg-slate-50 text-[10px] tracking-widest uppercase">
                Back to Shop
              </Button>
            </Link>
          </div>

        </CardContent>

        {/* Bottom Decorative Line */}
        <div className="h-1 w-full bg-slate-50" />
      </Card>
    </div>
  );
}