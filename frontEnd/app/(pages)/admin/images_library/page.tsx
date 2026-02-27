"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Copy, Trash2, Image as ImageIcon, Search, ListOrdered, Calendar, Link as LinkIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useGetImagesQuery,
  useDeleteImageMutation,
} from "../../../../redux/features/images/imageApiSlice";

interface ImageItem {
  image_id: number;
  image_url: string;
  created_at: string;
  product_id: number | null;
  is_main: boolean;
  product_title: string | null;
}

export default function ImagesTablePage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // تحويله لـ number للتعامل مع الـ Input
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetImagesQuery({ page, limit, sort, search });
  const [deleteImage] = useDeleteImageMutation();

  const images: ImageItem[] = data?.images || [];
  const totalPages = data?.totalPages || 1;

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard");
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteImage(id).unwrap();
      toast.success("Image removed successfully");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="p-8 bg-slate-50/30 min-h-screen space-y-6">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Images Gallery</h1>
          <p className="text-slate-500 text-sm font-medium">Global assets management and product image assignments.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Assets: </span>
          <span className="text-sm font-black text-blue-600">{data?.totalCount || images.length}</span>
        </div>
      </div>

      {/* Filters Bar - التعديل هنا ليكون موحد مع باقي الصفحات */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            placeholder="Search by product title..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="pl-9 h-10 text-xs border-slate-200"
          />
        </div>

        {/* Limit Input - تحويله لكتابة يدوية */}
        <div className="relative w-32">
          <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            type="number"
            placeholder="Limit"
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value) || 10);
            }}
            className="pl-9 h-10 text-xs font-bold border-slate-200"
          />
        </div>

        {/* Sort Select */}
        <div className="w-32">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 text-xs font-medium border-slate-200 bg-white">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest Assets</SelectItem>
              <SelectItem value="asc">Oldest Assets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="w-20 text-[10px] font-bold uppercase text-slate-400">Preview</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">Resource URL</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">Date Uploaded</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">Linked Product</TableHead>
              <TableHead className="text-center text-[10px] font-bold uppercase text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-[10px] text-slate-400 tracking-widest uppercase">
                  Synchronizing Assets...
                </TableCell>
              </TableRow>
            ) : images.map((img) => (
              <TableRow key={img.image_id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="p-1 bg-slate-50 rounded border border-slate-100">
                    <img src={img.image_url} alt="asset" className="w-10 h-10 object-contain rounded" />
                  </div>
                </TableCell>
                
                <TableCell className="max-w-[260px]">
                  <div className="flex items-center gap-2 group">
                    <LinkIcon size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span className="truncate text-[11px] font-mono text-slate-500">{img.image_url}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                      <Calendar size={11} className="text-slate-400" />
                      {new Date(img.created_at).toLocaleDateString()}
                    </div>
                    <span className="text-[10px] text-slate-400 px-4">{new Date(img.created_at).toLocaleTimeString()}</span>
                  </div>
                </TableCell>

                <TableCell>
                  {img.product_title ? (
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-blue-600">{img.product_title}</span>
                       {img.is_main && (
                         <span className="text-[9px] font-black uppercase text-emerald-500 tracking-tighter">● Main Image</span>
                       )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Unassigned</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 border-slate-200 transition-all" 
                      onClick={() => copyToClipboard(img.image_url)}
                      title="Copy URL"
                    >
                      <Copy size={13} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 border-slate-200 transition-all" 
                      onClick={() => handleDelete(img.image_id)}
                      title="Delete Image"
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

      {/* Pagination Footer */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          Assets Overview | Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] font-bold border-slate-200" 
            disabled={page <= 1} 
            onClick={() => setPage((p) => p - 1)}
          >
            PREVIOUS
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] font-bold border-slate-200" 
            disabled={page >= totalPages} 
            onClick={() => setPage((p) => p + 1)}
          >
            NEXT ASSETS
          </Button>
        </div>
      </div>
    </div>
  );
}