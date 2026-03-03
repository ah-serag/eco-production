"use client";

import React, { useState } from "react";
import { useGetClientOrdersQuery } from "@/redux/features/orders/ordersSlice";
import { Clock, MapPin, CreditCard, CheckCircle2, Hash, Calendar, Box, XCircle } from "lucide-react";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

export default function ClientOrdersPage() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading, isError } = useGetClientOrdersQuery({
    offset: (page - 1) * limit,
    limit: limit,
  });

  const orders = data?.data || [];
  const totalOrders = data?.total || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  if (isLoading) return <div className="p-4 bg-[#FAFAFA] min-h-screen flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">Loading...</div>;

  return (
    <div className="p-4 md:p-12 bg-[#FAFAFA] min-h-screen antialiased pb-20 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="space-y-1">
          <h1 className="text-lg md:text-xl font-semibold tracking-tight uppercase text-slate-800">My Orders</h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Transaction History</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {orders.map((order: any) => {
            // منطق الألوان المحدث
            const isCompleted = order.status === 'completed';
            const isCancelled = order.status === 'cancelled';
            const isProcessing = order.status === 'processing';
            const isPending = order.status === 'pending';

            return (
              <div key={order.id} className="relative bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all">
                
                {/* Status Sidebar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isCompleted ? 'bg-emerald-500' : 
                  isCancelled ? 'bg-rose-500' : 
                  isProcessing ? 'bg-blue-400' : 
                  'bg-amber-500'
                }`} />

                {/* Top Info Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-50">
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1">
                      <Hash size={10} className="text-slate-400" />
                      <span className="text-[10px] font-semibold font-mono">{order.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-slate-400" />
                      <span className="text-[10px] font-semibold uppercase">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Status Badge - Static (No Animation) */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    isCompleted ? 'bg-emerald-50 text-emerald-700' : 
                    isCancelled ? 'bg-rose-50 text-rose-700' : 
                    isProcessing ? 'bg-blue-50 text-blue-600' : 
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {isCompleted && <CheckCircle2 size={8} />}
                    {isCancelled && <XCircle size={8} />}
                    {(isProcessing || isPending) && <Clock size={8} />}
                    <span className="text-[8px] font-bold uppercase tracking-tighter">{order.status}</span>
                  </div>
                </div>

                <div className="p-4 md:p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Shipping & Payment */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin size={12} className="text-slate-300 mt-1" />
                        <div className="flex flex-col text-[10px]">
                          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">Ship to</span>
                          <span className="font-semibold text-slate-700 leading-tight">
                            {order.billing_details.first_name} {order.billing_details.last_name}
                          </span>
                          <span className="text-[9px] text-slate-500">{order.billing_details.street}, {order.billing_details.city}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CreditCard size={12} className="text-slate-300 mt-1" />
                        <div className="flex flex-col text-[10px]">
                          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">Payment</span>
                          <span className="font-semibold text-slate-700 uppercase">{order.payment_provider?.replace('_', ' ')}</span>
                          <div className="mt-1">
                            {order.is_paid ? (
                              <span className="text-[8px] font-bold text-emerald-600 uppercase flex items-center gap-0.5">
                                <CheckCircle2 size={8} /> Verified Paid
                              </span>
                            ) : (
                              <span className="text-[8px] font-bold text-blue-600 uppercase flex items-center gap-0.5">
                                <Clock size={8} /> Awaiting Payment
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items Overview */}
                    <div className="space-y-2">
                      <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest block mb-2">Items Overview</span>
                      <div className="space-y-1.5">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50/40 p-2 rounded-lg border border-slate-100">
                            <span className="text-[10px] font-semibold text-slate-700 truncate max-w-[150px]">{item.product_title}</span>
                            <div className="flex gap-3 items-center shrink-0">
                              <span className="text-[9px] font-bold text-slate-400">x{item.quantity}</span>
                              <span className="text-[10px] font-bold text-slate-700">{item.price} <span className="text-[8px] font-medium opacity-50">{order.currency}</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price Section with bg-chart-1 */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-2">
                        <Box size={12} className="text-slate-300" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{order.items.length} Product(s)</span>
                     </div>
                     
                     <div className="bg-chart-1 px-4 py-2 rounded-xl text-white shadow-sm flex flex-col items-end">
                        <span className="text-[8px] font-bold uppercase opacity-80 tracking-widest">Grand Total</span>
                        <div className="flex items-baseline gap-0.5">
                           <span className="text-sm font-semibold tracking-tighter">{order.total_amount}</span>
                           <span className="text-[8px] font-bold uppercase">{order.currency}</span>
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
          <div className="flex justify-center gap-4 pt-4 pb-10">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 text-slate-400">Prev</button>
            <span className="text-[10px] font-bold text-slate-800">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 text-chart-1">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}