"use client";

import React, { useState } from "react";
import { useGetOrdersQuery } from "../../../../redux/features/orders/ordersSlice";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Terminal, 
  FileDown, 
  Hash,
  Filter,
  ArrowUpRight,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Activity,
  ShieldCheck,
  Copy,
  Database,
  Smartphone
} from "lucide-react";
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InvoiceDocument } from "@/components/orders/InvoiceTemplate";
import { toast } from "sonner";

export default function OrdersPage() {
  const [filters, setFilters] = useState({ limit: 10, offset: 0, status: "", id: "" });
  const { data, isLoading } = useGetOrdersQuery(filters);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const isToday = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString).toDateString() === new Date().toDateString();
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      completed: { color: "text-emerald-700 bg-emerald-50", icon: <CheckCircle2 size={10} /> },
      processing: { color: "text-blue-700 bg-blue-50", icon: <Activity size={10} /> },
      pending: { color: "text-amber-700 bg-amber-50/50", icon: <Clock size={10} /> },
      cancelled: { color: "text-rose-700 bg-rose-50/50", icon: <XCircle size={10} /> },
    };
    const style = styles[status] || styles.pending;
    return (
      <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase", style.color)}>
        {style.icon} {status}
      </div>
    );
  };

  // Helper function to extract customer data from either billing_details or payment_response
  const getCustomerInfo = (order: any) => {
    const billing = order?.billing_details;
    const shipping = order?.payment_response?.order?.shipping_data;
    
    return {
      firstName: billing?.first_name || shipping?.first_name || "Guest",
      lastName: billing?.last_name || shipping?.last_name || "",
      phone: billing?.phone_number || shipping?.phone_number || "No Contact",
      city: billing?.city || shipping?.city || "N/A",
      state: billing?.state || shipping?.state || "N/A",
      street: billing?.street || shipping?.street || "N/A",
      building: billing?.building || shipping?.building || ""
    };
  };

  const customer = getCustomerInfo(selectedOrder);

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-6  text-slate-600 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Orders Registry</h1>
          <p className="text-slate-400 text-[11px] font-medium tracking-tight">Comprehensive log of all customer transactions.</p>
        </div>
        <div className=" border rounded-lg px-4 py-1.5 text-right">
           <span className="text-[10px] text-slate-600 font-semibold  m-2leading-tight uppercase tracking-wider">orders Total :</span>
           <span className="text-[10px] font-semibold text-chart-1 tracking-tighter">{data?.total || 0} </span>
        </div>
      </div>
          <hr />
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 `min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input 
            placeholder="Search by Order Identity..." 
            className="w-full pl-9 pr-4 py-2 text-[12px] border rounded-lg bg-white outline-none focus:border-slate-300 transition-all shadow-sm font-medium"
            onChange={(e) => setFilters({...filters, id: e.target.value})}
          />
        </div>

        <div className="bg-white border rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-300 uppercase">Limit:</span>
          <input 
            type="number"
            value={filters.limit}
            min="1"
            className="w-12 text-[11px] font-semibold bg-transparent outline-none text-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={(e) => setFilters({...filters, limit: Number(e.target.value) || 1})}
          />
        </div>

        <div className="bg-white border rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-2">
          <Filter size={12} className="text-slate-300" />
          <select 
            className="text-[11px] font-semibold bg-transparent outline-none text-slate-500 cursor-pointer appearance-none uppercase"
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">Status: All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 pl-6 uppercase">Order Identity</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 uppercase">Settlement Amount</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 text-center uppercase">Current Status</TableHead>
              <TableHead className="h-11 text-right text-[11px] font-semibold text-slate-400 pr-6 uppercase">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={4} className="text-center py-20 text-[11px] text-slate-300 font-semibold uppercase">Syncing Registry...</TableCell></TableRow>
            ) : data?.data.map((order: any) => {
                const today = isToday(order.created_at);
                const safeId = order.id?.toString() || "";
                return (
                  <TableRow 
                    key={order.id} 
                    className={cn("group cursor-pointer border-slate-50 hover:bg-slate-50/50 transition-colors relative", today && "bg-blue-50/10")}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="py-4 pl-6 relative">
                      {today && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-400" />}
                      <div className="flex items-center gap-2">
                         <Hash size={10} className="text-slate-300" />
                         <span className="font-mono text-[11px] font-medium text-slate-600 italic">ID-{safeId.slice(-8).toUpperCase()}</span>
                         {today && <span className="text-[9px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">Live Order</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[12px] font-semibold text-slate-800 tracking-tight">{order.total_amount} <span className="text-[10px] text-slate-400 font-medium">{order.currency}</span></span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">{getStatusBadge(order.status)}</div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                       <ArrowUpRight size={14} className="inline text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="sm:max-w-md p-0 bg-white border-l pt-10 shadow-2xl flex flex-col font-sans">
          
          <div className="p-6 border-b bg-slate-50/40">
            <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-bold  uppercase tracking-widest ">Transaction Profile</span>
               {selectedOrder && getStatusBadge(selectedOrder.status)}
            </div>
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-sm font-semibold text-slate-900 tracking-tight leading-none uppercase italic flex items-center gap-2">
                Order Identity: #{selectedOrder?.id?.toString().slice(-12).toUpperCase()}
              </SheetTitle>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <Calendar size={12} />
                <span>Registry Date: {new Date(selectedOrder?.created_at).toLocaleString()}</span>
              </div>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-chart-1 uppercase tracking-[0.2em] flex items-center gap-2 ">
                <User size={12} /> Customer Profile
              </h4>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-400 font-medium">Customer Full Name</span>
                  <span className="text-[11px] font-semibold text-slate-800">
                    {customer.firstName} {customer.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5"><Smartphone size={10}/> Contact</span>
                  <span className="text-[11px] font-semibold text-slate-800">{customer.phone}</span>
                </div>
                <div className="pt-3 mt-1 border-t border-slate-200/50 flex items-start gap-2 text-slate-500">
                  <MapPin size={12} className="text-slate-300 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">Shipping Address</span>
                    <span className="text-[10px] font-medium leading-relaxed">
                        {customer.city}, {customer.state}, {customer.street} {customer.building && ` - Bldg: ${customer.building}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

             <hr/>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-chart-1 uppercase tracking-[0.2em] flex items-center gap-2 ">
                <CreditCard size={12} /> Payment Logistics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg bg-white shadow-sm flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Provider</span>
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">{selectedOrder?.payment_provider}</span>
                </div>
                <div className="p-3 border rounded-lg bg-white shadow-sm flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Payment Type</span>
                  <span className="text-[11px] font-semibold text-slate-700 uppercase flex items-center gap-1.5">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    {selectedOrder?.payment_response?.source_data?.sub_type || (selectedOrder?.payment_provider === 'cash_on_delivery' ? 'CASH' : 'PROVIDER')}
                  </span>
                </div>
              </div>
            </div>
             
             <hr/>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-chart-1 uppercase tracking-[0.2em]">Ordered Products</h4>
              <div className="space-y-3">
                {selectedOrder?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start pb-3 border-b border-slate-50 last:border-0">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <span className="text-[11px] font-semibold text-slate-800 leading-snug tracking-tight">
                        {item.product_title}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-100/50 px-1.5 py-0.5 rounded border border-slate-200">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">PID:</span>
                          <span className="text-[9px] font-mono text-slate-600 truncate max-w-[80px]">
                            {item.product_id}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.product_id?.toString());
                            }}
                            className="hover:text-blue-500 text-slate-400 transition-colors ml-0.5"
                          >
                            <Copy size={10} />
                          </button>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 italic bg-slate-50 px-1.5 py-0.5 rounded border">
                          SKU: {item.product_id?.toString().slice(-6)}
                        </span>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono text-[9px]">
                          QNT: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-900 ml-4">
                      {(item.price_at_purchase * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
                  
              <hr/>

            <div className="pt-6 border-t border-slate-100 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ">Final Settlement</span>
                <span className="text-xl font-semibold tracking-tighter text-slate-900 italic">
                  {selectedOrder?.total_amount} <span className="text-[10px] text-slate-400 font-medium not-italic">{selectedOrder?.currency}</span>
                </span>
              </div>
            
                <hr/>

              {(selectedOrder?.status === "completed" || selectedOrder?.payment_provider === "cash_on_delivery") && (
                <PDFDownloadLink
                  document={<InvoiceDocument order={selectedOrder} />}
                  fileName={`INVOICE-${selectedOrder?.id?.toString().slice(-8).toUpperCase()}.pdf`}
                >
                  {({ loading }) => (
                    <Button 
                      disabled={loading} 
                      className="w-full bg-chart-1 text-white h-11 rounded-lg text-[11px] font-semibold uppercase tracking-[0.1em] hover:bg-chart-1/80 transition-all shadow-md"
                    >
                      <FileDown size={14} className="mr-2" />
                      {loading ? "Generating PDF..." : "Download Official Invoice"}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>

               <hr/>

            <div className="space-y-4 pt-4">
              <h4 className="text-[10px] font-bold text-chart-1 uppercase tracking-[0.2em] flex items-center gap-2 ">
                <Database size={12} /> System Identifiers
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "User ID", value: selectedOrder?.user_id },
                  { label: "Internal Order ID", value: selectedOrder?.id },
                  { label: "Gateway Transaction ID", value: selectedOrder?.payment_response?.id || "N/A" },
                  { label: "Gateway order ID", value: selectedOrder?.provider_order_id || "N/A" }
                ].map((id, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-md border border-slate-100 bg-white">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">{id.label}</span>
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[240px] select-all">{id.value || "N/A"}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(id.value?.toString())}
                      className="p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
             <hr/>

            {selectedOrder?.payment_response && (
              <div className="space-y-2  mb-2 pb-10">
                <div className="flex items-center gap-1.5">
                  <Activity size={12}  />
                  <span className="text-[9px] font-bold text-chart-1 uppercase tracking-widest ">Gateway Response Payload</span>
                </div>
                <div className="bg-gray-100 rounded-xl p-5  border shadow-inner overflow-hidden">
                  <div className="max-h-60 overflow-y-auto text-[10px] font-mono leading-relaxed scrollbar-hide">
                    <pre className="text-gray-700">
                      {JSON.stringify(selectedOrder.payment_response, null, 2)}
                    </pre>
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