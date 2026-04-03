"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, X , Upload } from "lucide-react";

import { useUploadImagesMutation } from "../../../../../redux/features/images/imageApiSlice";

export default function UploadImagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select images first");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await uploadImages(formData).unwrap();
      setUploadedUrls(res.images);
      toast.success("Images uploaded successfully!");
      setFiles([]);
      setPreviews([]);
    } catch (err: any) {
      toast.error(err?.data?.message || "Upload failed");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  return (
    <div className="w-full ">

      <div className="relative overflow-hidden mb-5 w-full text-slate-600 shadow-sm p-10 ">


        <div className="relative z-10 grid grid-cols-1  w-full md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-center justify-center shadow-sm  w-16 h-16 text-secondary rounded-xl ">
            <Upload/>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Image Management Center
            </h1>
            <span className="inline-block text-xs uppercase tracking-widest ">
              Media Infrastructure
            </span>
            <p className="max-w-2xl  text-sm leading-relaxed">
              Centralized image upload and URL management system.  
              Optimized for enterprise workflows, product catalogs, and content delivery.
            </p>
          </div>
        </div>
      </div>


      <div className="space-y-6  border p-5 shadow-sm">
       <div className="space-y-1 p-2 bg-gray-100">
      <h2 className="text-lg font-semibold text-slate-800">
        Upload Images
      </h2>
       <p className="text-md text-slate-600">
        Allowed formats: <span className="font-sm text-blue-500">JPG, PNG, SVG, WEBP</span>
       </p>
       <p className="text-md text-slate-600">
        MAX Size : <span className="font-sm text-blue-500">5M</span>
       </p>
        <p className="text-md text-slate-600">
         Limit : <span className="font-sm text-blue-500">10</span>
       </p>
       </div>

        <div className="space-y-4">
          <Label>Select Images</Label>
     
              <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md border "
              >
                <img src={src} className="w-full h-full object-contain" />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          className="bg-gray-100 shadow-md border w-full text-secondary hover:bg-gray-200/90 transition-all"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>

      {/* ================= Uploaded URLs ================= */}
      {uploadedUrls.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white  shadow-md overflow-hidden">
            <thead className=" text-slate-400 text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Preview</th>
                <th className="px-4 py-2 text-left">URL</th>
                <th className="px-4 py-2 text-left">Copy</th>
              </tr>
            </thead>
            <tbody>
              {uploadedUrls.map((url, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <img
                      src={url}
                      className="w-16 h-16 object-contain rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-blue-500 underline break-all">
                    {url}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(url)}
                      className="flex items-center gap-1"
                    >
                      <Copy size={14} /> Copy
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* ================= End Uploaded URLs ================= */}
    </div>
  );
}
