"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategorySelector from "@/components/public/CategorySelector";
import { toast } from "sonner";
import { FileCheck, FileX, PackagePlus } from "lucide-react";
import { productSchema } from "@/lib/zodSchema";
import { useAddProductWithImagesMutation } from "../../redux/features/productAdmin/productapiSlice";

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProduct() {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      title_ar: "", // الحقل الجديد
      slug: "",
      description: "",
      description_ar: "", // الحقل الجديد
      price: "",
      discount_price: "",
      stock: 0,
      sku: "",
      brand: "",
      weight: null,
      length: null,
      width: null,
      height: null,
      category_id: "",
      subcategory_id: "",
      is_active: true,
    },
  });

  const { handleSubmit, watch, setValue, register, formState: { errors, isSubmitting } } = methods;

  const titleVal = watch("title");

  // Auto-generate slug (يعتمد على العنوان الإنجليزي لضمان روابط SEO سليمة)
  useEffect(() => {
    if (!titleVal) return;
    const slug = titleVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setValue("slug", slug);
  }, [titleVal, setValue]);

  // File states
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [addProduct] = useAddProductWithImagesMutation();

  const normalizeNumeric = (value: any) => {
    return value === "" || value === null || value === undefined ? null : value;
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    if (!mainFile) {
      toast.error("Main image is required", { icon: <FileX /> });
      return;
    }

    try {
      const formData = new FormData();

      // Normalize and append data
      Object.entries(data).forEach(([key, value]) => {
        let v: any = value;

        if (["weight", "length", "width", "height", "discount_price", "stock"].includes(key)) {
          v = normalizeNumeric(value);
        }

        if (v !== undefined && v !== null) {
          formData.append(key, String(v));
        }
      });

      // Append images
      formData.append("mainImage", mainFile);
      galleryFiles.forEach((f) => formData.append("gallery", f));

      const result: any = await addProduct(formData).unwrap();

      toast.success(`Product created successfully!`, { icon: <FileCheck /> });

      // Reset form and files
      methods.reset();
      setMainFile(null);
      setMainPreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);

    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.data?.message || err.message || err}`, { icon: <FileX /> });
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden mb-10 rounded-md p-6 md:p-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start md:items-center gap-4 md:gap-6 max-w-xl">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-chart-1 shadow-md shrink-0">
              <PackagePlus className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-600">Add New Product</h2>
              <p className="text-sm text-gray-500">
                Easily add new products to your store with multi-language support (English & Arabic).
              </p>
            </div>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Titles & Slug Section */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium">Title (English)</label>
                <input {...register("title")} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-chart-1 outline-none" placeholder="e.g. Smart Watch" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div dir="rtl">
                <label className="block mb-1 text-sm font-medium text-right">العنوان (بالعربية)</label>
                <input {...register("title_ar")} className="w-full border rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-chart-1 outline-none" placeholder="مثال: ساعة ذكية" />
                {errors.title_ar && <p className="text-red-500 text-xs mt-1 text-right">{errors.title_ar.message as string}</p>}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-400">Slug (Auto-generated)</label>
              <input {...register("slug")} className="w-full border bg-gray-50 rounded-lg px-3 py-2 text-gray-500 italic" readOnly />
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Descriptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium">Description (English)</label>
                <textarea {...register("description")} className="w-full border rounded-lg px-3 py-2 min-h-[120px]" />
              </div>
              <div dir="rtl">
                <label className="block mb-1 text-sm font-medium text-right">الوصف (بالعربية)</label>
                <textarea {...register("description_ar")} className="w-full border rounded-lg px-3 py-2 text-right min-h-[120px]" />
              </div>
            </div>
          </div>

          {/* Prices & Inventory */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Price & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Price</label>
                <input type="number" step="0.01" {...register("price")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Discount Price</label>
                <input type="number" step="0.01" {...register("discount_price")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Stock Quantity</label>
                <input type="number" {...register("stock")} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>

          {/* SKU & Brand */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">SKU</label>
                <input {...register("sku")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Brand</label>
                <input {...register("brand")} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-700 mb-4">Shipping Dimensions</h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500">Weight (kg)</label>
                <input type="number" step="0.01" {...register("weight")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Length (cm)</label>
                <input type="number" step="0.01" {...register("length")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Width (cm)</label>
                <input type="number" step="0.01" {...register("width")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Height (cm)</label>
                <input type="number" step="0.01" {...register("height")} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
             <CategorySelector />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl">
            <input type="checkbox" {...register("is_active")} id="active-toggle" className="w-4 h-4 accent-chart-1" />
            <label htmlFor="active-toggle" className="font-medium text-gray-700 cursor-pointer">Make product visible in store</label>
          </div>

          {/* Images Section */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block mb-2 font-bold text-gray-700">Main Image</label>
              <Input type="file" accept="image/*" className="cursor-pointer" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setMainFile(file);
                  setMainPreview(URL.createObjectURL(file));
                }
              }} />
              {mainPreview && (
                <div className="relative w-48 h-48 mt-4 rounded-2xl overflow-hidden border-2 border-chart-1 shadow-xl">
                  <img src={mainPreview} className="w-full h-full object-cover" alt="Main Preview" />
                  <button type="button" onClick={() => { setMainFile(null); setMainPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600">×</button>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-bold text-gray-700">Product Gallery</label>
              <Input type="file" accept="image/*" multiple className="cursor-pointer" onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  setGalleryFiles(files);
                  setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                }} />
              <div className="flex gap-4 flex-wrap mt-4">
                {galleryPreviews.map((src, i) => (
                  <div key={i} className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                    <img src={src} className="w-full h-full object-cover" alt="Gallery Preview" />
                    <button type="button" onClick={() => {
                        const newFiles = [...galleryFiles];
                        const newPreviews = [...galleryPreviews];
                        newFiles.splice(i, 1);
                        newPreviews.splice(i, 1);
                        setGalleryFiles(newFiles);
                        setGalleryPreviews(newPreviews);
                      }} className="absolute top-1 right-1 bg-red-500/80 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-secondary hover:bg-secondary/90 w-full py-8 text-lg font-bold rounded-2xl shadow-lg transition-transform active:scale-[0.98]" disabled={isSubmitting}>
            {isSubmitting ? "Processing Request..." : "Publish Product to LumaCraft"}
          </Button>

        </form>
      </FormProvider>
    </div>
  );
}