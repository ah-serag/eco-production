"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Copy, Trash2, Search, ListOrdered, Calendar, Link as LinkIcon, Database, CheckCircle2 } from "lucide-react";
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
} from "../../../../../redux/features/images/imageApiSlice";

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
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetImagesQuery({ page, limit, sort, search });
  const [deleteImage] = useDeleteImageMutation();

  const images: ImageItem[] = data?.images || [];
  const totalPages = data?.totalPages || 1;
  const totalAssets = data?.total || 0; // استخدام الـ total القادم من السيرفر

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied", { description: "Image link ready to use.", duration: 1500 });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteImage(id).unwrap();
      toast.success("Deleted", { description: "Asset removed from cloud storage." });
    } catch {
      toast.error("Error", { description: "Could not remove the image." });
    }
  };

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-6 text-slate-600 font-sans">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Images Gallery</h1>
          <p className="text-slate-400 text-[11px] font-semibold tracking-tight uppercase">Global assets management and assignments.</p>
        </div>
        <div className="bg-white border rounded-lg px-4 py-1.5 shadow-sm text-right">
           <span className="text-[10px] text-slate-400 font-black block leading-tight uppercase tracking-wider">Total Assets</span>
           <span className="text-sm font-bold text-blue-600 tracking-tighter">
             {totalAssets.toLocaleString()} <span className="text-slate-900 text-[12px]">Files</span>
           </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <Input
            placeholder="Filter by product title..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
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
              setLimit(Number(e.target.value) || 10);
            }}
            className="w-10 text-[11px] font-bold bg-transparent outline-none text-slate-600"
          />
        </div>

        {/* Sort Select */}
        <Select value={sort} onValueChange={(val) => { setPage(1); setSort(val); }}>
          <SelectTrigger className="h-9 w-40 text-[11px] font-bold border rounded-lg bg-white shadow-sm">
            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-[11px]" value="desc">Newest Assets</SelectItem>
            <SelectItem className="text-[11px]" value="asc">Oldest Assets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="h-10 w-20 text-[10px] font-bold text-slate-400 pl-6 uppercase">Preview</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Resource Details</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Upload Date</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase">Assignment</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase text-center pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Syncing Cloud Assets...</TableCell></TableRow>
            ) : images.map((img) => (
              <TableRow key={img.image_id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <TableCell className="pl-6 py-3">
                  <div className="p-1 bg-slate-50 rounded border border-slate-100 w-11 h-11 flex items-center justify-center">
                    <img src={img.image_url} alt="asset" className="max-w-full max-h-full object-contain rounded-sm shadow-sm" />
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1 max-w-[300px]">
                    <div className="flex items-center gap-1.5">
                      <LinkIcon size={10} className="text-blue-400" />
                      <span className="truncate text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                        REF_{img.image_id.toString().padStart(6, '0')}
                      </span>
                    </div>
                    <span className="truncate text-[9px] text-slate-300 font-mono italic">{img.image_url}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <Calendar size={11} className="text-slate-300" />
                      {new Date(img.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono pl-4 uppercase">{new Date(img.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </TableCell>

                <TableCell>
                  {img.product_title ? (
                    <div className="flex flex-col gap-1">
                       <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors line-clamp-1">{img.product_title}</span>
                       {img.is_main && (
                         <div className="flex items-center gap-1">
                           <CheckCircle2 size={10} className="text-emerald-500" />
                           <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Primary Asset</span>
                         </div>
                       )}
                    </div>
                  ) : (
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-1.5 py-0.5 rounded bg-slate-50">Unlinked</span>
                  )}
                </TableCell>

                <TableCell className="pr-6 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600 border-slate-200 transition-all shadow-sm" 
                      onClick={() => copyToClipboard(img.image_url)}
                    >
                      <Copy size={12} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-7 w-7 hover:bg-rose-50 hover:text-rose-600 border-slate-200 transition-all shadow-sm" 
                      onClick={() => handleDelete(img.image_id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
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
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Button 
            variant="outline" 
            className="h-7 px-3 text-[9px] font-black border-slate-200 hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest"
            disabled={page >= totalPages} 
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}