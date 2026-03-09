"use client";

import React, { useState } from "react";
import { useGetClientOrdersQuery } from "@/redux/features/orders/ordersSlice";
import { Clock, MapPin, CreditCard, CheckCircle2, Hash, Calendar, Box, XCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl"; 

export default function ClientOrdersPage() {
  const t = useTranslations("order_client");
  const locale = useLocale(); 
  const isAr = locale === 'ar';
  
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading } = useGetClientOrdersQuery({
    offset: (page - 1) * limit,
    limit: limit,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const orders = data?.data || [];
  const totalOrders = data?.total || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const labelSize = isAr ? "text-[11px]" : "text-[10px]";
  const headingSize = isAr ? "text-lg md:text-2xl" : "text-lg md:text-xl";

  if (isLoading) return <div className={`p-4 bg-[#FAFAFA] min-h-screen flex items-center justify-center ${labelSize} font-normal uppercase tracking-widest text-slate-500`}>{t('loading')}</div>;

  return (
    <div className="p-4 md:p-12 bg-[#FAFAFA] min-h-screen antialiased pb-20 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-5">
        
        <header className="space-y-1 text-start">
          <h1 className={`${headingSize} font-normal tracking-tight uppercase text-slate-800`}>{t('title')}</h1>
          <p className={`${isAr ? "text-[13px]" : "text-[10px]"} text-slate-500 font-normal uppercase tracking-[0.2em]`}>{t('history')}</p>
        </header>
        <hr className="border-slate-200" />

        <div className="grid grid-cols-1 gap-6">
          {orders.map((order: any) => {
            const status = order.status;
            const isCompleted = status === 'completed';
            const isCancelled = status === 'cancelled';
            const isProcessing = status === 'processing';

            return (
              <div key={order.id} className="relative bg-white border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                
                {/* Status Sidebar */}
                <div className={`absolute inset-y-0 ${isAr ? 'right-0' : 'left-0'} w-1 ${
                  isCompleted ? 'bg-emerald-500' : 
                  isCancelled ? 'bg-rose-500' : 
                  isProcessing ? 'bg-blue-600' : 
                  'bg-amber-500'
                }`} />

                {/* Top Info Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-50">
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1">
                      <Hash size={10} className="text-slate-500" />
                      <span className="text-[10px] font-normal font-mono text-slate-700">{order.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-slate-500" />
                      <span className="text-[10px] font-normal uppercase text-slate-700">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    isCompleted ? 'bg-emerald-50 text-emerald-700' : 
                    isCancelled ? 'bg-rose-50 text-rose-700' : 
                    isProcessing ? 'bg-blue-50 text-blue-600' : 
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {isCompleted && <CheckCircle2 size={9} />}
                    {isCancelled && <XCircle size={9} />}
                    {!isCompleted && !isCancelled && <Clock size={9} />}
                    <span className={`${isAr ? "text-[13px]" : "text-[9px]"} font-normal uppercase tracking-tight`}>
                      {t(`status.${status}`)}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Shipping & Payment */}
                    <div className="space-y-4 text-start">
                      <div className="flex items-start gap-3">
                        <MapPin size={12} className="text-slate-300 mt-1" />
                        <div className="flex flex-col">
                          <span className={`${labelSize} font-normal text-slate-500 text-[12px] uppercase tracking-widest`}>{t('ship_to')}</span>
                          <span className={`${isAr ? "text-[13px]" : "text-[11px]"} font-normal text-slate-700 leading-tight`}>
                            {order.billing_details?.first_name} {order.billing_details?.last_name}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 font-normal">{order.billing_details?.street}, {order.billing_details?.city}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CreditCard size={12} className="text-slate-300 mt-1" />
                        <div className="flex flex-col">
                          <span className={`${labelSize} font-normal text-[12px] text-slate-500 uppercase tracking-widest`}>{t('payment')}</span>
                          <span className={`${isAr ? "text-[12px]" : "text-[10px]"} font-normal text-slate-700 uppercase`}>{order.payment_provider?.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items Overview */}
                    <div className="space-y-2 text-start">
                      <span className={`${labelSize} font-normal text-slate-500 text-[12px] uppercase tracking-widest block mb-2`}>{t('items_overview')}</span>
                      <div className="space-y-1.5">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                            <span className={`${isAr ? "text-[12px]" : "text-[11px]"} font-normal text-slate-700 truncate max-w-[150px]`}>{item.product_title}</span>
                            <div className="flex gap-3 items-center shrink-0">
                              <span className="text-[10px] font-normal text-slate-500">x{item.quantity}</span>
                              <span className={`${isAr ? "text-[12px]" : "text-[11px]"} font-normal text-slate-800`}>
                                {item.price} <span className="text-[13px] font-normal opacity-40">{t('currency')}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Box size={14} className="text-slate-300" />
                      <span className={`${isAr ? "text-[11px]" : "text-[9px]"} font-normal text-slate-600 uppercase tracking-tighter`}>
                        {t('products_count', { count: order.items.length })}
                      </span>
                    </div>
                    
                    <div className="bg-chart-1 px-4 py-2 text-white shadow-sm flex flex-col items-end min-w-[100px]">
                      <span className="text-[12px] font-normal uppercase tracking-widest">{t('grand_total')}</span>
                      <div className="flex items-baseline gap-1" dir="ltr">
                        <span className="text-base font-normal tracking-tighter">{order.total_amount}</span>
                        <span className="text-[13px] font-normal uppercase">{t('currency')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 pt-8 pb-10">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)} 
              className={`${labelSize} font-normal uppercase tracking-widest disabled:opacity-20 text-slate-500 hover:text-slate-800 transition-colors`}
            >
              {t('prev')}
            </button>
            <div className="bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
               <span className="text-[11px] font-normal text-slate-800">{page} / {totalPages}</span>
            </div>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)} 
              className={`${labelSize} font-normal uppercase tracking-widest disabled:opacity-20 text-chart-1 hover:scale-105 transition-transform`}
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}