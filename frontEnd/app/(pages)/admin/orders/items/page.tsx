"use client";

import React, { useState } from "react";
import { 
    Package, Hash, Calendar, ListOrdered, Copy, ExternalLink, Database
} from "lucide-react";

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetAllOrderItemsQuery } from "@/redux/features/orders/ordersSlice";
import { toast } from "sonner";

export default function OrderItemsPage() {
  const [filters, setFilters] = useState({ limit: 10, offset: 0, order_id: "", product_id: "" });
  const { data, isLoading } = useGetAllOrderItemsQuery(filters);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { description: text, duration: 1500 });
  };

  const isToday = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString).toDateString() === new Date().toDateString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-6 text-slate-600 font-sans">
      
      {/* Header with Total Records */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Sold Items Registry</h1>
          <p className="text-slate-400 text-[11px] font-semibold tracking-tight uppercase">Detailed tracking of every item processed.</p>
        </div>
        <div className="bg-white border rounded-lg px-4 py-1.5 shadow-sm text-right">
           <span className="text-[10px] font-semibold text-slate-600  m-2 leading-tight uppercase tracking-wider">Total Items orders :</span>
           <span className="text-sm  text-chart-1 tracking-tighter">
             {data?.total?.toLocaleString() } <span className="text-slate-900 text-[12px]"></span>
           </span>
        </div>
      </div>
      <hr />
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <Input 
            placeholder="Search Order ID..." 
            className="pl-9 h-9 text-[11px] font-semibold border rounded-lg bg-white shadow-sm focus:border-slate-400"
            onChange={(e) => setFilters({...filters, order_id: e.target.value})}
          />
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <Input 
            placeholder="Search Product ID..." 
            className="pl-9 h-9 text-[11px] font-semibold border rounded-lg bg-white shadow-sm focus:border-slate-400"
            onChange={(e) => setFilters({...filters, product_id: e.target.value})}
          />
        </div>
        
        <div className="bg-white border rounded-lg px-3 py-1 shadow-sm flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-300 uppercase">Limit:</span>
          <input 
            type="number"
            value={filters.limit}
            className="w-10 text-[11px] font-bold bg-transparent outline-none text-slate-600"
            onChange={(e) => setFilters({...filters, limit: parseInt(e.target.value) || 10})}
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 pl-6 uppercase">ID</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Product Details</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase text-center">Order Source</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase text-center">Qty</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Settlement</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase pr-6 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={6} className="text-center py-20 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Syncing Records...</TableCell></TableRow>
            ) : data?.data.map((item: any) => {
              const today = isToday(item.order_date);
              const isCompleted = item.order_status === "completed";
              
              return (
                <TableRow 
                  key={item.id} 
                  className={cn("group hover:bg-slate-50/50 transition-colors relative border-slate-50", today && "bg-blue-50/10")}
                >
                  <TableCell className="py-3 pl-6 font-mono text-[9px] text-slate-400 relative">
                    {today && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-400" />}
                    #{item.id}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800 text-[11px] leading-none tracking-tight">
                        {item.product_title || "Standard Product"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">
                          PID: {item.product_id?.toString().slice(-8).toUpperCase()}
                        </span>
                        <button onClick={() => copyToClipboard(item.product_id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-500 transition-all">
                          <Copy size={10} />
                        </button>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-700 font-mono text-[10px]">#{item.order_id?.toString().slice(-8).toUpperCase()}</span>
                        <button onClick={() => copyToClipboard(item.order_id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-500 transition-all">
                          <Copy size={10} />
                        </button>
                      </div>
                      <Badge className={cn(
                          "text-[8px] px-1.5 py-0 font-black uppercase tracking-tighter border-none shadow-none",
                          isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                         {item.order_status || 'Paid'}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                     <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono text-[10px]">
                       x{item.quantity}
                     </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-900 tracking-tighter">
                        {(item.quantity * item.price_at_purchase).toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">EGP</span>
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                        @{item.price_at_purchase}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className={cn("inline-flex items-center gap-1 text-[10px] font-bold", today ? "text-blue-500" : "text-slate-400")}>
                      <Calendar size={10} />
                      {formatDate(item.order_date)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-2 pt-2">
        <div className="flex items-center gap-2">
          <Database size={12} className="text-slate-300" />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Showing {data?.data.length || 0} items per page
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button 
            variant="outline" 
            className="h-7 px-3 text-[9px] font-black border-slate-200 hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest"
            disabled={filters.offset === 0} 
            onClick={() => setFilters({...filters, offset: Math.max(0, filters.offset - filters.limit)})}
          >
            Prev
          </Button>
          <Button 
            variant="outline" 
            className="h-7 px-3 text-[9px] font-black border-slate-200 hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest"
            onClick={() => setFilters({...filters, offset: filters.offset + filters.limit})}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}