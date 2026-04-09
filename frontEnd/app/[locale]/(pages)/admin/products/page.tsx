"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Table, TableHeader, TableRow, TableCell,
  TableBody, TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EditProduct from "@/components/manage/editingProduct";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package, MoreHorizontal, Edit, Trash2, Power,
  Search, ChevronLeft, ChevronRight, ExternalLink, ShieldAlert,
} from "lucide-react";
import {
  useGetProductsAdminQuery,
  useToggleActiveMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} from "../../../../../redux/features/productAdmin/productapiSlice";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  description: string;
  discount_price?: number | null;
  is_active: boolean;
  image_url: string;
  slug?: string;
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
  const [page, setPage]                   = useState(1);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditOpen, setIsEditOpen]       = useState(false);
  const [deleteOpen, setDeleteOpen]       = useState(false);
  const [toDelete, setToDelete]           = useState<any>(null);

  const methods = useForm<FormValues>({
    defaultValues: { status: "", limit: 10, category_id: undefined, search: "", sort_by: "created_at" },
  });
  const { watch, setValue } = methods;
  const status      = watch("status");
  const limit       = watch("limit");
  const category_id = watch("category_id");
  const search      = watch("search");
  const sort_by     = watch("sort_by");

  const { data, isLoading, refetch } = useGetProductsAdminQuery({ page, limit, status, category_id, search, sort_by });
  const [toggleActive] = useToggleActiveMutation();
  const [editProduct]  = useEditProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  useEffect(() => { refetch(); }, [status, limit, category_id, search, sort_by, page, refetch]);

  const handleToggle = async (id: number) => {
    try {
      await toggleActive(id).unwrap();
      toast.success("Visibility updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  const handleSave = async (payload: any) => {
    try {
      await editProduct({ id: payload.id, data: payload }).unwrap();
      toast.success("Product updated");
      setIsEditOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await deleteProduct(toDelete.id).unwrap();
      toast.success(res.message || "Product deleted");
      setDeleteOpen(false);
      setToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Deletion failed");
      setDeleteOpen(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 bg-[#f8f8f8] min-h-screen space-y-5 font-sans">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Products</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Manage inventory, pricing, and visibility.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
            <Package size={13} className="text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-600">{data?.total?.toLocaleString() ?? "—"}</span>
            <span className="text-[10px] text-slate-300 font-medium">total</span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
            <Input
              placeholder="Search by title…"
              value={search}
              onChange={(e) => { setPage(1); setValue("search", e.target.value); }}
              className="pl-9 h-9 text-[12px] bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-slate-300"
            />
          </div>

          <Select
            value={category_id ? category_id.toString() : "all"}
            onValueChange={(v) => { setPage(1); setValue("category_id", v === "all" ? undefined : Number(v)); }}
          >
            <SelectTrigger className="h-9 w-44 text-[11px] font-semibold bg-white border-slate-200 shadow-sm rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-[11px]" value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} className="text-[11px]" value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => { setPage(1); setValue("status", v); }}>
            <SelectTrigger className="h-9 w-36 text-[11px] font-semibold bg-white border-slate-200 shadow-sm rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-[11px]" value="all">All Status</SelectItem>
              <SelectItem className="text-[11px]" value="active">Active</SelectItem>
              <SelectItem className="text-[11px]" value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort_by} onValueChange={(v) => { setPage(1); setValue("sort_by", v as any); }}>
            <SelectTrigger className="h-9 w-36 text-[11px] font-semibold bg-white border-slate-200 shadow-sm rounded-xl">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-[11px]" value="created_at">Newest first</SelectItem>
              <SelectItem className="text-[11px]" value="oldest">Oldest first</SelectItem>
              <SelectItem className="text-[11px]" value="price">By price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50/70">
                <TableHead className="h-10 w-16 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5">Image</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock</TableHead>
                <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
                <TableHead className="h-10 w-12 pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <Package size={28} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-[11px] font-semibold text-slate-400">No products found</p>
                  </TableCell>
                </TableRow>
              ) : data?.products?.map((p: Product) => (
                <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/40 transition-colors group">

                  {/* Image */}
                  <TableCell className="pl-5 py-3">
                    <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center">
                      <img src={p.image_url} alt={p.title} className="max-w-full max-h-full object-contain" />
                    </div>
                  </TableCell>

                  {/* Product */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-semibold text-slate-800 leading-tight">{p.title}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-slate-300 font-mono">SKU #{p.id.toString().padStart(5, "0")}</span>
                        <span className="text-slate-200">·</span>
                        <Link
                          href={`/product/${p.slug || p.id}`}
                          target="_blank"
                          className="text-[9px] text-slate-400 hover:text-sky-500 underline underline-offset-2 flex items-center gap-0.5 transition-colors"
                        >
                          View <ExternalLink size={8} />
                        </Link>
                      </div>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-semibold text-slate-800">
                        {(p.discount_price || p.price).toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">EGP</span>
                      </p>
                      {p.discount_price && (
                        <p className="text-[10px] text-slate-300 line-through">
                          {p.price.toLocaleString()} EGP
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                      p.stock > 10
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : p.stock > 0
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-rose-50 text-rose-500 border-rose-100"
                    )}>
                      {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full ring-2 ring-offset-1",
                        p.is_active
                          ? "bg-emerald-500 ring-emerald-100"
                          : "bg-slate-300 ring-slate-100"
                      )} />
                      <span className={cn(
                        "text-[10px] font-semibold",
                        p.is_active ? "text-emerald-600" : "text-slate-400"
                      )}>
                        {p.is_active ? "Active" : "Draft"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 shadow-lg border-slate-100 rounded-xl">
                        <DropdownMenuLabel className="text-[9px] font-bold uppercase text-slate-400 tracking-wider py-2">
                          Actions
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => { setEditingProduct(p); setIsEditOpen(true); }}
                          className="text-[12px] font-medium cursor-pointer py-2 rounded-lg focus:bg-slate-50"
                        >
                          <Edit className="mr-2 h-3.5 w-3.5 text-slate-400" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleToggle(p.id)}
                          className="text-[12px] font-medium cursor-pointer py-2 rounded-lg focus:bg-slate-50"
                        >
                          <Power className={cn("mr-2 h-3.5 w-3.5", p.is_active ? "text-rose-400" : "text-emerald-400")} />
                          {p.is_active ? "Set as Draft" : "Publish"}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuItem
                          onClick={() => { setToDelete(p); setDeleteOpen(true); }}
                          className="text-[12px] font-medium cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50 py-2 rounded-lg"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-slate-400">
            Page <span className="font-semibold text-slate-600">{page}</span> of{" "}
            <span className="font-semibold text-slate-600">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon"
              className="h-8 w-8 rounded-xl border-slate-200 shadow-sm hover:bg-white"
              disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft size={13} />
            </Button>
            <Button variant="outline" size="icon"
              className="h-8 w-8 rounded-xl border-slate-200 shadow-sm hover:bg-white"
              disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight size={13} />
            </Button>
          </div>
        </div>

        {/* ── Edit Dialog ── */}
        {editingProduct && (
          <EditProduct
            product={editingProduct}
            open={isEditOpen}
            onClose={() => { setIsEditOpen(false); setEditingProduct(null); }}
            onSave={handleSave}
          />
        )}

        {/* ── Delete Dialog ── */}
        {toDelete && (
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="max-w-xs rounded-2xl border-none shadow-2xl p-6">
              <DialogHeader className="flex flex-col items-center gap-3 mb-1">
                <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center">
                  <ShieldAlert className="text-rose-500" size={20} />
                </div>
                <DialogTitle className="text-[13px] font-semibold text-slate-900">Delete Product</DialogTitle>
              </DialogHeader>
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">"{toDelete.title}"</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 h-9 text-[11px] rounded-xl"
                  onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1 h-9 text-[11px] rounded-xl"
                  onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </FormProvider>
  );
}
