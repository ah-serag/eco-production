"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, X, Video, Film } from "lucide-react";

import { useUploadVideosMutation } from "../../../../../../redux/features/AdminVideos/AdminVideosSclice";



export default function UploadVideosPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const [uploadVideos, { isLoading: uploading }] = useUploadVideosMutation();

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
      toast.error("Please select videos first");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("videos", file));

    try {
      const res = await uploadVideos(formData).unwrap();
      setUploadedUrls(res.videos || res.urls || []); 
      toast.success("Videos uploaded successfully!");
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
    <div className="w-full">
      {/* Header */}
      <div className="relative overflow-hidden mb-5 w-full text-slate-600 shadow-sm p-10">
        <div className="relative z-10 grid grid-cols-1 w-full md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-center justify-center shadow-sm w-16 h-16 text-secondary rounded-xl">
            <Video />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Video Management Center
            </h1>
            <span className="inline-block text-xs uppercase tracking-widest">
              Media Infrastructure
            </span>
            <p className="max-w-2xl text-sm leading-relaxed">
              Centralized video upload and URL management system. 
              Optimized for high-quality product showcases and tutorials.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 border p-5 shadow-sm">
        <div className="space-y-1 p-2 bg-gray-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Upload Videos
          </h2>
          <p className="text-md text-slate-600">
            Allowed formats: <span className="font-sm text-blue-500">MP4, WEBM, QUICKTIME</span>
          </p>
          <p className="text-md text-slate-600">
            MAX Size: <span className="font-sm text-blue-500">50MB</span>
          </p>
          <p className="text-md text-slate-600">
            Limit: <span className="font-sm text-blue-500">3</span>
          </p>
        </div>

        <div className="space-y-4">
          <Label>Select Videos</Label>
          <Input
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative w-40 h-24 rounded-lg overflow-hidden shadow-md border bg-black"
              >
                <video src={src} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                   <Film className="text-white" size={20} />
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs z-20"
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
          {uploading ? "Uploading Videos..." : "Upload Videos"}
        </Button>
      </div>

      {/* ================= Uploaded URLs ================= */}
      {uploadedUrls.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white shadow-md overflow-hidden">
            <thead className="text-slate-400 text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Preview</th>
                <th className="px-4 py-2 text-left">URL</th>
                <th className="px-4 py-2 text-left">Copy</th>
              </tr>
            </thead>
      <tbody>
     {uploadedUrls.map((video :any , index) => (
      <tr key={video.id || index} className="border-b">
      <td className="px-4 py-2">
        <video
          src={video.url} 
          className="w-24 h-16 object-cover bg-black"
          muted
        />
      </td>
      <td className="px-4 py-2 text-blue-500 underline break-all">
        <a target="_blank" href={video.url}>
        <span className="text-[10px] text-gray-400 block">ID: {video.id}</span>
        {video.url}
        </a>
      </td>
      <td className="px-4 py-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => copyToClipboard(video.url)}
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
    </div>
  );
}