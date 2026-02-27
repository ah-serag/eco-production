"use client";

import React, { useState } from "react";
import { 
    Package, Hash, 
    Calendar, ListOrdered
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

export default function OrderItemsPage() {
  const [filters, setFilters] = useState({ limit: 10, offset: 0, order_id: "", product_id: "" });
  const { data, isLoading } = useGetAllOrderItemsQuery(filters);

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
    <div className="p-8 bg-slate-50/30 min-h-screen space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sold Items Registry</h1>
        <p className="text-slate-500 text-sm">Detailed tracking of every item processed through the warehouse.</p>
      </div>

      {/* Filters Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Order ID..." 
              className="pl-9 h-10 text-xs"
              onChange={(e) => setFilters({...filters, order_id: e.target.value})}
            />
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Product ID..." 
              className="pl-9 h-10 text-xs"
              onChange={(e) => setFilters({...filters, product_id: e.target.value})}
            />
          </div>
          
          {/* Limit Input - تم تحويله لكتابة بدلاً من select */}
          <div className="relative w-32">
            <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              type="number"
              placeholder="Limit"
              value={filters.limit}
              className="pl-9 h-10 text-xs font-bold"
              onChange={(e) => setFilters({...filters, limit: parseInt(e.target.value) || 10})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-[30%]">Product Details</TableHead>
              <TableHead>Order Source</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={7} className="text-center py-20 text-slate-400 uppercase text-[10px] tracking-widest">Loading...</TableCell></TableRow>
            ) : data?.data.map((item: any) => {
              const today = isToday(item.order_date);
              const isCompleted = item.order_status === "completed";
              
              return (
                <TableRow 
                  key={item.id} 
                  className={cn(
                    "hover:bg-slate-50 transition-colors relative",
                    today && "bg-blue-50/30"
                  )}
                >
                  <TableCell className="font-mono text-[10px] text-slate-400">
                    {today && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                    #{item.id}
                  </TableCell>
                  
                  {/* عرض الاسم وتحته الـ ID */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-900 text-[13px] leading-tight">
                        {item.product_title || "Standard Product"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        REF: #{item.product_id}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-[11px]">Order #{item.order_id.toString().slice(-8)}</span>
                      {/* تمييز الـ Completed باللون الأخضر */}
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "w-fit text-[9px] mt-1 px-1.5 py-0 font-bold uppercase",
                          isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500"
                        )}
                      >
                         {item.order_status || 'Paid'}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                     <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded text-xs">
                       x{item.quantity}
                     </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-600">
                    {item.price_at_purchase} <span className="text-[9px]">EGP</span>
                  </TableCell>

                  <TableCell className="font-black text-slate-900 text-xs">
                    {(item.quantity * item.price_at_purchase).toFixed(2)}
                  </TableCell>

                  <TableCell className="text-[10px] text-slate-500">
                    <div className={cn("flex items-center gap-1", today && "text-blue-600 font-bold")}>
                      <Calendar size={11} />
                      {formatDate(item.order_date)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-2">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
          Showing {data?.data.length || 0} items in this view
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold" disabled={filters.offset === 0} 
            onClick={() => setFilters({...filters, offset: Math.max(0, filters.offset - filters.limit)})}>
            PREVIOUS
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold"
            onClick={() => setFilters({...filters, offset: filters.offset + filters.limit})}>
            NEXT PAGE
          </Button>
        </div>
      </div>
    </div>
  );
}