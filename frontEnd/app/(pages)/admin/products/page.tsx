"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EditProduct from "@/components/manage/editingProduct";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, MoreHorizontal, Edit, Trash2, Power, Search, ListOrdered, Filter } from "lucide-react";
import {
  useGetProductsAdminQuery,
  useToggleActiveMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} from "../../../../redux/features/productAdmin/productapiSlice";
import { cn } from "@/lib/utils";

// Types remains the same
type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  description: string;
  discount_price?: number | null;
  is_active: boolean;
  image_url: string;
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
      <div className="p-8 bg-slate-50/30 min-h-screen space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products Manager</h1>
            <p className="text-slate-500 text-sm font-medium">Manage inventory, status, and product details.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">In Stock: </span>
            <span className="text-sm font-black text-blue-600">{data?.total || 0} Items</span>
          </div>
        </div>

        {/* Filters Bar - Updated to Match Requests */}
        <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setValue("search", e.target.value);
              }}
              className="pl-9 h-10 text-xs border-slate-200"
            />
          </div>

          {/* Limit Input - الكتابة اليدوية كما طلبت */}
          <div className="relative w-28">
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

          {/* Category Select */}
          <div className="w-40">
            <Select
              value={category_id ? category_id.toString() : "all"}
              onValueChange={(val) => {
                setPage(1);
                setValue("category_id", val === "all" ? undefined : Number(val));
              }}
            >
              <SelectTrigger className="h-10 text-xs font-medium border-slate-200 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Select */}
          <div className="w-32">
            <Select
              value={sort_by}
              onValueChange={(val) => {
                setPage(1);
                setValue("sort_by", val as any);
              }}
            >
              <SelectTrigger className="h-10 text-xs font-medium border-slate-200 bg-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="w-20 text-[10px] font-bold uppercase text-slate-400">Image</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Product Title</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Price</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Stock</TableHead>
                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Status</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20 text-[10px] text-slate-400 tracking-widest uppercase">Fetching Inventory...</TableCell></TableRow>
              ) : data?.products.map((p: Product) => (
                <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <img src={p.image_url} alt={p.title} className="w-10 h-10 object-contain bg-slate-50 rounded border border-slate-100" />
                  </TableCell>
                  <TableCell className="font-bold text-slate-700 text-xs">{p.title}</TableCell>
                  <TableCell className="text-xs font-medium text-slate-600">${p.discount_price || p.price}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      p.stock > 0 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {p.stock} in stock
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", p.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                      <span className="text-[10px] font-bold uppercase text-slate-500">{p.is_active ? "Live" : "Draft"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100"><MoreHorizontal size={14} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase text-slate-400">Options</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditProduct(p)} className="text-xs cursor-pointer font-medium">
                          <Edit className="mr-2 h-3.5 w-3.5" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(p.id)} className="text-xs cursor-pointer font-medium">
                          <Power className="mr-2 h-3.5 w-3.5 text-blue-500" /> {p.is_active ? "Set Inactive" : "Set Active"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => { setProductToDelete(p); setDeleteDialogOpen(true); }}
                          className="text-xs cursor-pointer font-medium text-rose-600 focus:text-rose-600"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              PREVIOUS
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              NEXT PAGE
            </Button>
          </div>
        </div>

        {/* Dialogs remain identical logic-wise */}
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
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold uppercase tracking-tight">Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to remove <strong>{productToDelete.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" className="h-9 text-xs font-bold" onClick={() => setDeleteDialogOpen(false)}>CANCEL</Button>
                <Button variant="destructive" className="h-9 text-xs font-bold px-6" onClick={handleDeleteConfirmed}>DELETE</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </FormProvider>
  );
}