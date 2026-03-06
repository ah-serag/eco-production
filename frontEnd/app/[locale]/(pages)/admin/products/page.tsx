"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EditProduct from "@/components/manage/editingProduct";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link"; // أضفت Link لدعم الانتقال للمنتج
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, MoreHorizontal, Edit, Trash2, Power, Search, ListOrdered, Database, ChevronRight, ExternalLink } from "lucide-react";
import {
  useGetProductsAdminQuery,
  useToggleActiveMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} from "../../../../../redux/features/productAdmin/productapiSlice";
import { cn } from "@/lib/utils";

// Types
type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  description: string;
  discount_price?: number | null;
  is_active: boolean;
  image_url: string;
  slug?: string; // أضفت الـ slug لو كان متاحاً في بياناتك
};

type FormValues = {
  status: string;
  limit: number;
  category_id?: number;
  search: string;
  sort_by: "created_at" | "price" | "oldest";
};

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Beauty & Personal Care" },
  { id: 4, name: "Home & Kitchen" },
  { id: 5, name: "Sports & Outdoors" },
  { id: 6, name: "Grocery" },
  { id: 7, name: "Baby Products" },
  { id: 8, name: "Automotive" },
  { id: 9, name: "Computers & Accessories" },
];

export default function ProductsAdmin() {
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const methods = useForm<FormValues>({
    defaultValues: {
      status: "",
      limit: 10,
      category_id: undefined,
      search: "",
      sort_by: "created_at",
    },
  });

  const { watch, setValue } = methods;
  const status = watch("status");
  const limit = watch("limit");
  const category_id = watch("category_id");
  const search = watch("search");
  const sort_by = watch("sort_by");

  const { data, isLoading, refetch } = useGetProductsAdminQuery({
    page,
    limit,
    status,
    category_id,
    search,
    sort_by,
  });

  const [toggleActive] = useToggleActiveMutation();
  const [editProduct] = useEditProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const handleToggleActive = async (id: number) => {
    await toggleActive(id);
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (p: any) => {
    setEditingProduct(p);
    setIsEditOpen(true);
  };

  const handleSave = async (payload: any) => {
    await editProduct({ id: payload.id, data: payload });
    setIsEditOpen(false);
    setEditingProduct(null);
  };

  useEffect(() => {
    refetch();
  }, [status, limit, category_id, search, sort_by, page, refetch]);

  return (
    <FormProvider {...methods}>
      <div className="p-8 bg-[#fafafa] min-h-screen space-y-6 text-slate-600 font-sans">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Products Manager</h1>
            <p className="text-slate-400 text-[11px] font-semibold tracking-tight uppercase">Manage inventory, status, and details.</p>
          </div>
          <div className="bg-white border rounded-lg px-4 py-1.5 shadow-sm text-right">
             <span className="text-[10px] font-semibold text-slate-600  m-2 leading-tight uppercase tracking-wider">Inventory Total :</span>
             <span className="text-sm  text-chart-1 tracking-tighter">
               {data?.total?.toLocaleString() || 0} 
             </span>
          </div>
        </div>
          <hr />
        {/* Filters Bar */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setValue("search", e.target.value);
              }}
              className="pl-9 h-9 text-[11px] font-semibold border rounded-lg bg-white shadow-sm focus:border-slate-400"
            />
          </div>

          {/* Limit Input */}
          <div className="bg-white border rounded-lg px-3 py-1 shadow-sm flex items-center gap-2 h-9">
            <span className="text-[10px] font-black text-slate-300 uppercase">Limit:</span>
            <input
              type="number"
              value={limit}
              onChange={(e) => {
                setPage(1);
                setValue("limit", Number(e.target.value) || 10);
              }}
              className="w-10 text-[11px] font-bold bg-transparent outline-none text-slate-600"
            />
          </div>

          {/* Category Select */}
          <Select
            value={category_id ? category_id.toString() : "all"}
            onValueChange={(val) => {
              setPage(1);
              setValue("category_id", val === "all" ? undefined : Number(val));
            }}
          >
            <SelectTrigger className="h-9 w-40 text-[11px] font-bold border rounded-lg bg-white shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-[11px]" value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} className="text-[11px]" value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Select */}
          <Select
            value={status}
            onValueChange={(val) => {
              setPage(1);
              setValue("status", val);
            }}
          >
            <SelectTrigger className="h-9 w-32 text-[11px] font-bold border rounded-lg bg-white shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-[11px]" value="active">Active Only</SelectItem>
              <SelectItem className="text-[11px]" value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select
            value={sort_by}
            onValueChange={(val) => {
              setPage(1);
              setValue("sort_by", val as any);
            }}
          >
            <SelectTrigger className="h-9 w-32 text-[11px] font-bold border rounded-lg bg-white shadow-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-[11px]" value="created_at">Newest First</SelectItem>
              <SelectItem className="text-[11px]" value="oldest">Oldest First</SelectItem>
              <SelectItem className="text-[11px]" value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="h-10 w-20 text-[10px] font-bold text-slate-400 pl-6 uppercase">Preview</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Product Details</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Settlement</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Inventory</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Visibility</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Syncing Inventory...</TableCell></TableRow>
              ) : data?.products.map((p: Product) => (
                <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-6 py-3">
                    <img src={p.image_url} alt={p.title} className="w-9 h-9 object-contain bg-slate-50 rounded border border-slate-100 p-0.5" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 text-[11px] leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                        {p.title}
                      </span>
                      {/* Product URL Line */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Path:</span>
                        <Link 
                          href={`/product/${p.slug || p.id}`} 
                          target="_blank"
                          className="text-[9px] font-medium text-slate-400 hover:text-blue-500 underline decoration-slate-200 underline-offset-2 flex items-center"
                        >
                          /product/{p.slug || p.id}
                          <ExternalLink size={8} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">SKU: #{p.id.toString().padStart(5, '0')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-900 tracking-tighter">
                        {p.discount_price || p.price} <span className="text-[9px] text-slate-400 font-normal">EGP</span>
                      </span>
                      {p.discount_price && (
                        <span className="text-[8px] text-slate-300 line-through font-bold">
                          {p.price} EGP
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                      p.stock > 0 ? "bg-blue-50 text-gray-700" : "bg-rose-50 text-rose-600"
                    )}>
                      {p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", p.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300")} />
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{p.is_active ? "Live" : "Draft"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-slate-100 hover:text-blue-600"><MoreHorizontal size={14} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 shadow-xl border-slate-100">
                        <DropdownMenuLabel className="text-[9px] font-black uppercase text-slate-400 px-3 py-2">Inventory Options</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditProduct(p)} className="text-[11px] cursor-pointer font-bold py-2">
                          <Edit className="mr-2 h-3.5 w-3.5 text-slate-400" /> Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(p.id)} className="text-[11px] cursor-pointer font-bold py-2">
                          <Power className={cn("mr-2 h-3.5 w-3.5", p.is_active ? "text-rose-400" : "text-emerald-400")} /> {p.is_active ? "Set as Draft" : "Publish Live"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => { setProductToDelete(p); setDeleteDialogOpen(true); }}
                          className="text-[11px] cursor-pointer font-bold text-rose-600 focus:text-rose-600 py-2"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Permanent Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center px-2 pt-2">
          <div className="flex items-center gap-2">
            <Database size={12} className="text-slate-300" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Page {page} of {totalPages}
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              className="h-7 px-3 text-[9px] font-black border-slate-200 hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest"
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <Button 
              variant="outline" 
              className="h-7 px-3 text-[9px] font-black border-slate-200 hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest"
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Dialogs */}
        {editingProduct && (
          <EditProduct
            product={editingProduct}
            open={isEditOpen}
            onClose={() => { setIsEditOpen(false); setEditingProduct(null); }}
            onSave={(payload) => handleSave(payload)}
          />
        )}

        {productToDelete && (
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-sm rounded-xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-[13px] font-black uppercase tracking-tight text-slate-900">Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Are you sure you want to remove <span className="text-slate-900 font-bold">"{productToDelete.title}"</span>? This action is irreversible.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" className="h-8 text-[10px] font-black uppercase tracking-widest" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" className="h-8 text-[10px] font-black px-6 uppercase tracking-widest shadow-lg shadow-rose-100" onClick={handleDeleteConfirmed}>Confirm Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </FormProvider>
  );
}