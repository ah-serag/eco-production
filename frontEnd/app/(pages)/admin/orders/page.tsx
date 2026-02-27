"use client";

import React, { useState } from "react";
import { useGetOrdersQuery } from "../../../../redux/features/orders/ordersSlice";
import { Search, MoreHorizontal, CheckCircle2, Clock, XCircle, Terminal, FileDown } from "lucide-react";
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InvoiceDocument } from "@/components/orders/InvoiceTemplate";

export default function OrdersPage() {
  const [filters, setFilters] = useState({ limit: 10, offset: 0, status: "", id: "" });
  const { data, isLoading } = useGetOrdersQuery(filters);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const isToday = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString).toDateString() === new Date().toDateString();
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: { color: "text-amber-600", icon: <Clock size={10} /> },
      completed: { color: "text-emerald-600", icon: <CheckCircle2 size={10} /> },
      cancelled: { color: "text-rose-600", icon: <XCircle size={10} /> },
    };
    const style = styles[status] || styles.pending;
    return (
      <div className={cn("flex items-center gap-1 text-[9px] font-bold uppercase", style.color)}>
        {style.icon} {status}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen space-y-4 text-slate-900">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-tight">Orders Registry</h1>
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-medium">Warehouse Control Panel</p>
      </div>

      {/* Filters Bar */}
      <div className="flex gap-4 items-center border-b pb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input 
            placeholder="Search ID..." 
            className="w-full pl-8 pr-4 py-1.5 text-[11px] border-none bg-slate-50 rounded outline-none focus:ring-1 ring-slate-100"
            onChange={(e) => setFilters({...filters, id: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-300">LIMIT:</span>
          <input 
            type="number"
            value={filters.limit}
            className="w-12 py-1 text-[11px] font-bold text-center border-none bg-slate-50 rounded outline-none"
            onChange={(e) => setFilters({...filters, limit: parseInt(e.target.value) || 0})}
          />
        </div>

        <select 
          className="text-[10px] font-bold bg-transparent border-none outline-none text-slate-400 cursor-pointer"
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">STATUS: ALL</option>
          <option value="pending">PENDING</option>
          <option value="completed">COMPLETED</option>
          <option value="cancelled">CANCELLED</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-50">
              <TableHead className="h-8 text-[9px] font-bold uppercase text-slate-300">Order Reference</TableHead>
              <TableHead className="h-8 text-[9px] font-bold uppercase text-slate-300">Amount</TableHead>
              <TableHead className="h-8 text-[9px] font-bold uppercase text-slate-300">Status</TableHead>
              <TableHead className="h-8 text-right text-[9px] font-bold uppercase text-slate-300">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={4} className="text-center py-10 text-[10px] text-slate-300 uppercase tracking-widest">Fetching Data...</TableCell></TableRow>
            ) : data?.data.map((order: any) => {
                const today = isToday(order.created_at);
                return (
                  <TableRow 
                    key={order.id} 
                    className={cn("group cursor-pointer border-slate-50 hover:bg-slate-50/50 relative", today && "bg-blue-50/10")}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="py-2.5 relative">
                      {today && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />}
                      <div className="flex flex-col pl-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 uppercase">#{order.id.slice(-8)}</span>
                        {today && <span className="text-[8px] font-bold text-blue-500 mt-0.5 tracking-tighter uppercase">Today</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold">{order.total_amount} <span className="text-[9px] text-slate-300 font-normal uppercase">{order.currency}</span></TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={12} /></Button>
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Details Side Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="sm:max-w-xs p-6 pt-10 bg-white border-l shadow-2xl overflow-y-auto">
          <div className="mb-6 space-y-1 border-b pb-4">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Summary</span>
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </div>
            <SheetTitle className="text-xs font-semibold uppercase tracking-tight">Ref: {selectedOrder?.id.slice(-8)}</SheetTitle>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Line Items</p>
              
              {selectedOrder?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col border-b border-slate-50 pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      {/* عرض اسم المنتج (العنوان) فوق الـ ID */}
                      <span className="text-[10px] font-bold text-slate-900 leading-tight">
                        {item.product_title || "Standard Product Item"}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-400">ID: #{item.product_id}</span>
                        <span className="text-[9px] font-bold bg-slate-100 px-1 rounded text-slate-600">x{item.quantity}</span>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-bold text-slate-900">
                      {(item.price_at_purchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-bold text-slate-300 uppercase">Grand Total</span>
                <span className="text-sm font-bold tracking-tighter text-slate-900">
                  {selectedOrder?.total_amount} {selectedOrder?.currency}
                </span>
              </div>

              {selectedOrder?.status === "completed" && (
                <PDFDownloadLink
                  document={<InvoiceDocument order={selectedOrder} />}
                  fileName={`INV-${selectedOrder.id.slice(-8)}.pdf`}
                >
                  {({ loading }) => (
                    <Button disabled={loading} className="w-full bg-chart-1 text-white h-9 rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-chart-1/80 transition-colors">
                      <FileDown size={12} className="mr-2" />
                      {loading ? "Generating PDF..." : "Export Invoice"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>

            {/* Gateway Debug Log */}
            {selectedOrder?.payment_response && (
              <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-1.5 mb-3">
                  <Terminal size={10} className="text-slate-300" />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Gateway Response Log</span>
                </div>
                <div className="bg-slate-50 rounded p-3 border border-slate-100">
                  <div className="max-h-40 overflow-y-auto text-[8px] font-mono text-slate-500 leading-relaxed scrollbar-hide">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedOrder.payment_response, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}