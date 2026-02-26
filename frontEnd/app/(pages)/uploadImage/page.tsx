"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface UploadImageProps {
  productId: number | null;
}

export default function UploadImage({ productId }: UploadImageProps) {
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [message, setMessage] = useState<string | null>(null);

  const uploadMainImage = async () => {
    if (!mainFile) return alert("Choose an image");
    if (!productId) {
      alert("Product ID is missing : add product first");
      setMessage("Add product first");
      return;
    }
    const formData = new FormData();
    formData.append("image", mainFile);
    formData.append("productId", String(productId));
    try {
      const res = await fetch(`http://localhost:3000/upload/main-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to upload main image");
    }
  };

  const uploadGalleryImages = async () => {
    if (!galleryFiles.length) return alert("Choose at least one image");
    if (!productId) {
      alert("Product ID is missing : add product first");
      setMessage("Add product first");
      return;
    }
    const formData = new FormData();
    galleryFiles.forEach((file) => formData.append("images", file));
    formData.append("productId", String(productId));
    try {
      const res = await fetch(`http://localhost:3000/upload/images`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to upload gallery images");
    }
  };

  const removeMainImage = () => {
    setMainFile(null);
    setMainPreview(null);
  };

  const removeGalleryImage = (index: number) => {
    const newFiles = [...galleryFiles];
    const newPreviews = [...galleryPreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  const buttonClass =
    "px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition transform duration-200";

  return (
    <div className="pt-10 space-y-12">
      {/* ==================== Main Image ==================== */}
      <div className="space-y-3 ">
        <h1 className="text-2xl font-bold">Upload Main Image</h1>
        <Input
          type="file"
          accept="image/*"
          className="mb-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              setMainFile(file);
              setMainPreview(URL.createObjectURL(file));
            }
          }}
        />
        {mainPreview && (
          <div className="relative w-60 h-60 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img
              src={mainPreview}
              alt="Main Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={removeMainImage}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold shadow hover:bg-red-700 transition"
            >
              ×
            </button>
          </div>
        )}
        <button
          onClick={uploadMainImage}
          className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}
        >
          Upload Main Image
        </button>
      </div>

      {/* ==================== Gallery Images ==================== */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Upload Gallery Images</h1>
        <Input
          type="file"
          accept="image/*"
          multiple
          className="mb-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            setGalleryFiles(files);
            setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
          }}
        />
        <div className="flex gap-4 flex-wrap">
          {galleryPreviews.map((src, idx) => (
            <div
              key={idx}
              className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={src}
                alt={`Gallery Preview ${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeGalleryImage(idx)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow hover:bg-red-700 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={uploadGalleryImages}
          className={`${buttonClass} bg-green-600 hover:bg-green-700`}
        >
          Upload Gallery Images
        </button>
      </div>

      {/* ==================== Message ==================== */}
      {message && <h1 className="text-2xl text-center mt-4">{message}</h1>}
    </div>
  );
}
