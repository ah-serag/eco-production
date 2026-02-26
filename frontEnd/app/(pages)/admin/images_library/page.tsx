"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Copy, Trash2, Image as ImageIcon } from "lucide-react";
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
  const [limit, setLimit] = useState("10");
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetImagesQuery({ page, limit, sort, search });
  const [deleteImage] = useDeleteImageMutation();

  const images: ImageItem[] = data?.images || [];
  const totalPages = data?.totalPages || 1;

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteImage(id).unwrap();
      toast.success("Image deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full mx-auto   bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="relative overflow-hidden mb-5 rounded-md  p-6 md:p-10 text-white bg-secondary">

   
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-start md:items-center gap-4 md:gap-6 max-w-xl">
           <div className="flex items-center justify-center w-16 h-16 rounded-xl  bg-chart-1">
              <ImageIcon />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Images Manager</h2>
              <p className="text-sm text-gray-300">
                Manage all images, assign to products, set main images, copy URLs, or delete efficiently.
              </p>
              <p className="text-sm text-gray-400">Total Images: {images.length}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Search by Product</label>
              <Input
                placeholder="Search by product title..."
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                className="w-60 bg-white text-black"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Show per page</label>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger className="w-24 bg-white text-black">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Sort</label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-28 bg-white  text-black">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="p-1">
          <Table className="border " >
            <TableHeader>
            <TableRow className="bg-gray-100">
                <TableCell >Preview</TableCell>
                <TableCell>URL</TableCell>
                <TableCell >Created</TableCell>
                <TableCell >Product</TableCell>
                <TableCell >Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((img , index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition">
                  <TableCell className="items-center">
                  <img src={img.image_url}  className="w-12 h-12 object-contain rounded" />

                  </TableCell>
                  <TableCell className="max-w-[260px] truncate text-xs text-secondary">{img.image_url}</TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {new Date(img.created_at).toLocaleDateString()} <br />
                    <span className="text-[11px] text-gray-400">{new Date(img.created_at).toLocaleTimeString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${img.is_main ? " text-secondary" : ""}`}>
                        {img.product_title ?? "------------"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => copyToClipboard(img.image_url)}>
                        <Copy size={14} />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleDelete(img.image_id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
        <p className="text-sm text-gray-700">Page <b>{page}</b> of <b>{totalPages}</b></p>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
