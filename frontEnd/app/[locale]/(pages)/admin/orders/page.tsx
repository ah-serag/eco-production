"use client";

import React, { useState } from "react";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "../../../../../redux/features/orders/ordersSlice";
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
  Smartphone,
  Mail,
  AlertTriangle,
  Banknote,
  Globe,
  Wallet,
  Package,
  Phone,
  ChevronLeft,
  ChevronRight,
  Tag,
  ShoppingCart
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
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = data?.total ? Math.ceil(data.total / filters.limit) : 1;
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ order_id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

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

  const getCustomerInfo = (order: any) => {
    const billing = order?.billing_details;
    const shipping = order?.payment_response?.order?.shipping_data;
    
    return {
      firstName: billing?.first_name || shipping?.first_name || "Guest",
      lastName: billing?.last_name || shipping?.last_name || "",
      phone: billing?.phone_number || shipping?.phone_number || "No Contact",
      email: billing?.email || shipping?.email || "no email",
      city: billing?.city || shipping?.city || "N/A",
      state: billing?.state || shipping?.state || "N/A",
      street: billing?.street || shipping?.street || "N/A",
      building: billing?.building || shipping?.building || ""
    };
  };



  const customer = getCustomerInfo(selectedOrder);

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-6 text-slate-600 font-sans">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white  flex items-center justify-center shadow-sm">
            <ShoppingCart size={16} className="text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Orders Registry</h1>
            <p className="text-slate-400 text-[11px] font-medium tracking-tight">Comprehensive log of all customer transactions.</p>
          </div>
        </div>
        <div className="border bg-white rounded-lg px-4 py-1.5 text-right">
          <span className="text-[14px] text-slate-600 font-semibold  leading-tight uppercase tracking-wider">orders Total :</span>
          <span className="text-[14px] font-semibold text-chart-1 tracking-wide"> {data?.total || 0}</span>
        </div>
      </div>
      <hr />
      
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-60">
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

      <div className="bg-white rounded border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 pl-6 uppercase">Order Identity</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 uppercase">Date</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 uppercase">Settlement Amount</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 uppercase">Items</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 uppercase">Customer Details</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 uppercase">Payment</TableHead>
              <TableHead className="h-11 text-[11px] font-semibold text-slate-400 text-center uppercase">Update Status</TableHead>
              <TableHead className="h-11 text-right text-[11px] font-semibold text-slate-400 pr-6 uppercase">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={8} className="text-center py-20 text-[11px] text-slate-300 font-semibold uppercase">Syncing Registry...</TableCell></TableRow>
            ) : data?.data.map((order: any) => {
                const today = isToday(order.created_at);
                const safeId = order.id?.toString() || "";
                const rowCustomer = getCustomerInfo(order);
                // استخراج الـ type والـ sub_type للجدول
                const pType = order.payment_response?.source_data?.type;
                const pSubType = order.payment_response?.source_data?.sub_type;

                return (
                  <TableRow 
                    key={order.id} 
                    className={cn("group border-slate-50 hover:bg-slate-100 transition-colors relative", today && "bg-blue-50/10")}
                  >
                    <TableCell className="py-4 pl-6 relative cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      {today && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-400" />}
                      <div className="flex items-center gap-2">
                         <Hash size={10} className="text-slate-300" />
                         <span className="font-mono text-[11px] font-medium text-slate-600 italic">ID-{safeId.slice(-8).toUpperCase()}</span>
                         {today && <span className="text-[9px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">Live</span>}
                      </div>
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-slate-700">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.created_at ? new Date(order.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <span className="text-[12px] font-semibold text-slate-800 tracking-tight">{order.total_amount} <span className="text-[10px] text-slate-400 font-medium">{order.currency}</span></span>
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <div className="flex items-center gap-1.5">
                        <Package size={11} className="text-slate-400" />
                        <span className="text-[11px] font-semibold text-slate-700">{order.items?.length ?? 0}</span>
                        <span className="text-[10px] text-slate-400">item{order.items?.length !== 1 ? "s" : ""}</span>
                      </div>
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-slate-800 tracking-tight">{rowCustomer.firstName} {rowCustomer.lastName}</span>
                        <span className="text-[10px] text-slate-400 lowercase">{rowCustomer.email}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">{rowCustomer.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                          <span className="text-[11px] font-semibold text-slate-700 uppercase flex items-center gap-1.5">
    {order?.payment_provider === 'cash on delivary' ? (
      <Banknote size={12} className="text-blue-900" />
    ) : order?.payment_response?.source_data?.sub_type?.toLowerCase() === 'wallet' ? (
      <Wallet size={12} className="text-amber-600" />
    ) : (
      <CreditCard size={12} className="text-emerald-600" />
    )}
    {order?.payment_response?.source_data?.type 
      ? `${order.payment_response.source_data.type} ${order.payment_response.source_data.sub_type ? `(${order.payment_response.source_data.sub_type})` : ''}`
      : (order?.payment_provider === 'cash on delivary' ? 'CASH' : 'PROVIDER')
    }
  </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={cn(
                            "text-[10px] font-bold py-1 px-2 rounded border outline-none cursor-pointer transition-all uppercase",
                            order.status === 'completed' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                            order.status === 'processing' && "bg-blue-50 text-blue-700 border-blue-100",
                            order.status === 'pending' && "bg-amber-50 text-amber-700 border-amber-100",
                            order.status === 'cancelled' && "bg-rose-50 text-rose-700 border-rose-100"
                          )}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                       <ArrowUpRight size={14} onClick={() => setSelectedOrder(order)} className="inline text-slate-300 group-hover:text-blue-500 transition-colors cursor-pointer" />
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-slate-50/50">
          <span className="text-[11px] text-slate-400 font-medium">
            Showing {filters.offset + 1}–{Math.min(filters.offset + filters.limit, data?.total ?? 0)} of <span className="font-semibold text-slate-600">{data?.total ?? 0}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
              className="p-1.5 rounded border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-[11px] font-semibold text-slate-600 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
              className="p-1.5 rounded border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

   <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
  <SheetContent className="sm:max-w-md p-0 bg-white border-l pt-10 shadow-2xl flex flex-col font-sans">
    
    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Profile</span>
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
      {/* Failure Reason Section */}
      {(selectedOrder?.status === 'cancelled' || selectedOrder?.payment_response?.error_occured) && (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 space-y-2">
          <h4 className="text-[10px] font-bold text-rose-700 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={12} /> Failure Reason
          </h4>
          <p className="text-[11px] font-medium text-rose-600 italic">
            {selectedOrder?.payment_response?.data?.message || selectedOrder?.payment_response?.error_msg || "Transaction was declined or manually cancelled."}
          </p>
        </div>
      )}

      {/* Customer Profile */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <User size={12} /> Customer Profile
        </h4>
        <div className="bg-slate-50/50 rounded-lg p-4 space-y-3 border border-slate-200/60">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 font-medium">Full Name</span>
            <span className="text-[11px] font-semibold text-slate-800">{customer.firstName} {customer.lastName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5"><Smartphone size={10}/> Contact</span>
            <span className="text-[11px] font-semibold text-slate-800">{customer.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5"><Mail size={10}/> Email</span>
            <span className="text-[11px] font-semibold text-slate-800 lowercase">{customer.email}</span>
          </div>
          <div className="pt-3 mt-1 border-t border-slate-200 flex items-start gap-2 text-slate-500">
            <MapPin size={12} className="text-slate-400 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">Shipping Address</span>
              <span className="text-[10px] font-medium leading-relaxed text-slate-600">
                {customer.city}, {customer.state}, {customer.street} {customer.building && ` - Bldg: ${customer.building}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />
      
      {/* Payment Logistics */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <CreditCard size={12} /> Payment Logistics
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-slate-200/60 rounded-lg bg-white shadow-sm flex flex-col gap-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Provider</span>
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">{selectedOrder?.payment_provider}</span>
          </div>
          <div className="p-3 border border-slate-200/60 rounded-lg bg-white shadow-sm flex flex-col gap-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Payment Type</span>
            <span className="text-[11px] font-semibold text-slate-700 uppercase flex items-center gap-1.5">
              {selectedOrder?.payment_provider === 'cash on delivary' || selectedOrder?.payment_provider === 'cash_on_delivery' ? (
                <Banknote size={12} className="text-emerald-600" />
              ) : selectedOrder?.payment_response?.source_data?.sub_type?.toLowerCase() === 'wallet' ? (
                <Wallet size={12} className="text-blue-600" />
              ) : (
                <CreditCard size={12} className="text-slate-700" />
              )}
              {selectedOrder?.payment_response?.source_data?.type 
                ? `${selectedOrder.payment_response.source_data.type} ${selectedOrder.payment_response.source_data.sub_type ? `(${selectedOrder.payment_response.source_data.sub_type})` : ''}`
                : (selectedOrder?.payment_provider === 'cash on delivary' || selectedOrder?.payment_provider === 'cash_on_delivery' ? 'CASH' : 'PROVIDER')
              }
            </span>
          </div>

          {/* New Wallet Details Section */}
          {(selectedOrder?.payment_response?.data?.wallet_issuer || selectedOrder?.payment_response?.data?.wallet_msisdn) && (
            <>
              <div className="p-3 border border-slate-200/60 rounded-lg bg-blue-50/30 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Wallet Issuer</span>
                <span className="text-[11px] font-semibold text-slate-800 uppercase tracking-tight">
                  {selectedOrder.payment_response.data.wallet_issuer || "N/A"}
                </span>
              </div>
              <div className="p-3 border border-slate-200/60 rounded-lg bg-blue-50/30 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Wallet Number</span>
                <span className="text-[11px] font-semibold text-slate-800 font-mono tracking-tight">
                  {selectedOrder.payment_response.data.wallet_msisdn || "N/A"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
        
      <hr className="border-slate-100" />
      
      {/* Ordered Products */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <ShoppingCart size={12} /> Ordered Products
          <span className="ml-auto text-[9px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {selectedOrder?.items?.length ?? 0} item{selectedOrder?.items?.length !== 1 ? "s" : ""}
          </span>
        </h4>
        <div className="space-y-3">
          {selectedOrder?.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-0">
              {/* Product Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.product_title}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 mr-3 shrink-0"
                />
              )}
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[11px] font-semibold text-slate-800 leading-snug tracking-tight">{item.product_title}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">PID:</span>
                    <span className="text-[9px] font-mono text-slate-600 truncate max-w-[80px]">{item.product_id}</span>
                    <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.product_id?.toString()); }} className="hover:text-blue-600 text-slate-400 transition-colors ml-0.5">
                      <Copy size={10} />
                    </button>
                  </div>
                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono text-[9px]">QNT: {item.quantity}</span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {item.price_at_purchase?.toLocaleString()} × {item.quantity}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 ml-4">
                <span className="text-[11px] font-semibold text-slate-900">
                  {(item.price_at_purchase * item.quantity).toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400">{selectedOrder?.currency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
            
      <hr className="border-slate-100" />
      
      {/* Final Settlement */}
      <div className="pt-2 space-y-6">
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Final Settlement</span>
          <span className="text-xl font-semibold tracking-tighter text-slate-900 italic">
            {selectedOrder?.total_amount} <span className="text-[10px] text-slate-500 font-medium not-italic">{selectedOrder?.currency}</span>
          </span>
        </div>
      
        {(selectedOrder?.status === "completed" || selectedOrder?.payment_provider === "cash_on_delivery" || selectedOrder?.payment_provider === "cash on delivary") && (
          <PDFDownloadLink
            document={<InvoiceDocument order={selectedOrder} />}
            fileName={`INVOICE-${selectedOrder?.id?.toString().slice(-8).toUpperCase()}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading} className="w-full bg-slate-900 text-white h-11 rounded-lg text-[11px] font-semibold uppercase tracking-[0.1em] hover:bg-slate-800 transition-all shadow-md">
                <FileDown size={14} className="mr-2" />
                {loading ? "Generating PDF..." : "Download Official Invoice"}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      <hr className="border-slate-100" />
      
      {/* System Identifiers */}
      <div className="space-y-4 pt-2">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Database size={12} /> System Identifiers
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: "User ID", value: selectedOrder?.user_id },
            { label: "Internal Order ID", value: selectedOrder?.id },
            { label: "Gateway Transaction ID", value: selectedOrder?.payment_response?.id || "N/A" },
            { label: "Gateway order ID", value: selectedOrder?.provider_order_id || "N/A" }
          ].map((id, i) => (
            <div key={i} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-200/60 bg-slate-50/50">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{id.label}</span>
                <span className="text-[10px] font-mono text-slate-600 truncate max-w-[240px] select-all">{id.value || "N/A"}</span>
              </div>
              <button onClick={() => copyToClipboard(id.value?.toString())} className="p-1.5 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 hover:text-blue-600 transition-all shadow-sm">
                <Copy size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />
      
      {/* Gateway Response Payload */}
      {selectedOrder?.payment_response && (
        <div className="space-y-3 mb-2 pb-10">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-slate-400" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Gateway Response Payload</span>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-inner overflow-hidden">
            <div className="max-h-60 overflow-y-auto text-[10px] font-mono leading-relaxed scrollbar-hide">
              <pre className="text-emerald-400">{JSON.stringify(selectedOrder.payment_response, null, 2)}</pre>
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