"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EditProduct from "@/components/manage/editingProduct";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { 
  ShoppingBag, 
  Search, 
  ListOrdered, 
  Mail, 
  Package, 
  DollarSign, 
  Edit3, 
  Trash2, 
  PowerOff,
  Activity
} from "lucide-react";
import {
  useToggleActiveMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} from "../../../../../redux/features/productAdmin/productapiSlice";

import {
    useGetProductsAndVendorsAdminQuery
} from "../../../../../redux/features/users/vendorSlice";

type Productvendors = {
  id: number;
  title: string;
  price: number;
  stock: number;
  description: string;
  discount_price?: number | null;
  is_active: boolean;
  image_url: string;
  email: string;
};

type FormValues = {
  status: string;
  limit: number;
  search: string;
};

export default function ProductsAdmin() {
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const methods = useForm<FormValues>({
    defaultValues: {
         status : "",
         limit: 10,
         search: "",
    },
  });

  const { watch, setValue } = methods;
  const status = watch("status");
  const limit = watch("limit");
  const search = watch("search");

  const { data, isLoading, refetch } = useGetProductsAndVendorsAdminQuery({
    page,
    limit,
    status,
    search
  });

  const [toggleActive] = useToggleActiveMutation();
  const [editProduct] = useEditProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const handleToggleActive = async (id: number) => {
    try {
      await toggleActive(id).unwrap();
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id).unwrap();
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch {
      toast.error("Delete operation failed");
    }
  };

  const handleEditProduct = (p: any) => {
    setEditingProduct(p);
    setIsEditOpen(true);
  };

  const handleSave = async (payload: any) => {
    try {
      await editProduct({ id: payload.id, data: payload }).unwrap();
      toast.success("Product updated");
      setIsEditOpen(false);
      setEditingProduct(null);
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    refetch();
  }, [status, limit, search, page, refetch]);

  return (
    <FormProvider {...methods}>
      <div className="p-8 bg-slate-50/30 min-h-screen space-y-6">
        <Toaster position="top-right" richColors />

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory & Vendors</h1>
            <p className="text-slate-500 text-sm font-medium">Global oversight of vendor products and stock levels.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-4">
            <div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Products</span>
               <span className="text-sm font-black text-blue-600">{data?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* --- Filters Bar --- */}
        <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search by vendor email..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setValue("search", e.target.value);
              }}
              className="pl-9 h-10 text-xs border-slate-200"
            />
          </div>

          {/* Limit Input - الكتابة اليدوية الموحدة */}
          <div className="relative w-32">
            <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              type="number"
              placeholder="Limit"
              value={limit}
              onChange={(e) => {
                setPage(1);
                setValue("limit", Number(e.target.value) || 10);
              }}
              className="pl-9 h-10 text-xs font-bold border-slate-200"
            />
          </div>

          {/* Status Select */}
          <div className="w-32">
            <Select
              value={status}
              onValueChange={(val) => {
                setPage(1);
                setValue("status", val);
              }}
            >
              <SelectTrigger className="h-10 text-xs font-medium border-slate-200 bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="w-20 text-[10px] font-bold uppercase text-slate-400">Preview</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Product Info</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Vendor Source</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Pricing</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400 text-center">Status</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20 text-[10px] text-slate-400 tracking-widest uppercase">Analyzing Inventory...</TableCell></TableRow>
              ) : data?.productsVendors.map((p: Productvendors) => (
                <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="p-1 bg-slate-50 rounded border border-slate-100">
                      <img src={p.image_url} alt={p.title} className="w-10 h-10 object-contain rounded" />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{p.title}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Package size={10} /> Stock: <span className={p.stock < 5 ? "text-rose-500 font-bold" : ""}>{p.stock}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 group">
                      <Mail size={12} className="text-slate-300" />
                      <span className="text-[11px] font-medium text-blue-600/80 tracking-tight">{p.email}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-xs font-black text-slate-700">
                      <DollarSign size={11} className="text-slate-400" />
                      {p.discount_price || p.price}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-400"}`} />
                       <span className="text-[10px] font-bold uppercase text-slate-500">{p.is_active ? "Active" : "Disabled"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`h-8 w-8 transition-colors ${p.is_active ? "hover:bg-amber-50 hover:text-amber-600" : "hover:bg-emerald-50 hover:text-emerald-600"}`}
                        onClick={() => handleToggleActive(p.id)}
                        title={p.is_active ? "Deactivate" : "Activate"}
                      >
                        {p.is_active ? <PowerOff size={13} /> : <Activity size={13} />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" 
                        onClick={() => handleEditProduct(p)}
                        title="Edit Details"
                      >
                        <Edit3 size={13} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600" 
                        onClick={() => {
                          setProductToDelete(p);
                          setDeleteDialogOpen(true);
                        }}
                        title="Delete Product"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* --- Pagination Footer --- */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Stock Registry | Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              PREVIOUS
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              NEXT BATCH
            </Button>
          </div>
        </div>

        {/* --- Dialogs --- */}
        {editingProduct && (
          <EditProduct
            product={editingProduct}
            open={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setEditingProduct(null);
            }}
            onSave={(payload) => handleSave(payload)}
          />
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold uppercase text-rose-600 tracking-tight">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">{productToDelete?.title}</span> from the inventory? This action is permanent.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" className="text-[10px] font-bold uppercase" onClick={() => setDeleteDialogOpen(false)}>Keep Product</Button>
              <Button variant="destructive" className="text-[10px] font-bold uppercase px-6" onClick={handleDeleteConfirmed}>Delete Asset</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </FormProvider>
  );
}