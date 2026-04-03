"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategorySelector from "@/components/public/CategorySelector";
import { toast } from "sonner";
import { FileCheck, FileX, PackagePlus, Video, Film, Image as ImageIcon, X } from "lucide-react";
import { productSchema } from "@/lib/zodSchema";
import { useAddProductWithImagesMutation } from "../../redux/features/productAdmin/productapiSlice";

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProduct() {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      title_ar: "", 
      slug: "",
      description: "",
      description_ar: "", 
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

  // Auto-generate Slug
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

  // --- Media States ---
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [mainVideoFile, setMainVideoFile] = useState<File | null>(null);
  const [mainVideoPreview, setMainVideoPreview] = useState<string | null>(null);
  const [videoGalleryFiles, setVideoGalleryFiles] = useState<File[]>([]);
  const [videoGalleryPreviews, setVideoGalleryPreviews] = useState<string[]>([]);

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

      // Append Text Data
      Object.entries(data).forEach(([key, value]) => {
        let v: any = value;
        if (["weight", "length", "width", "height", "discount_price", "stock"].includes(key)) {
          v = normalizeNumeric(value);
        }
        if (v !== undefined && v !== null) {
          formData.append(key, String(v));
        }
      });

      // Append Image Files
      formData.append("mainImage", mainFile);
      galleryFiles.forEach((f) => formData.append("gallery", f));

      // Append Video Files
      if (mainVideoFile) formData.append("mainVideo", mainVideoFile);
      videoGalleryFiles.forEach((f) => formData.append("videoGallery", f));

      await addProduct(formData).unwrap();

      toast.success(`Product created successfully!`, { icon: <FileCheck /> });

      // Reset Form & States
      methods.reset();
      setMainFile(null);
      setMainPreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setMainVideoFile(null);
      setMainVideoPreview(null);
      setVideoGalleryFiles([]);
      setVideoGalleryPreviews([]);

    } catch (err: any) {
      toast.error(`${err.data?.message || err.message || "Failed to add product"}`);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden mb-10 p-6 md:p-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start md:items-center gap-4 md:gap-6 max-w-xl">
            <div className="flex items-center justify-center w-16 h-16 shadow-md shrink-0 bg-gray-50 rounded-xl">
              <PackagePlus className="w-8 h-8 text-secondary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700">Add New Product</h2>
              <p className="text-sm text-gray-500">Configure your product details, images, and videos for the marketplace.</p>
            </div>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section: Basic Information */}
          <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Title (English)</label>
                <input {...register("title")} className="w-full border px-3 py-2.5 outline-none focus:ring-2 focus:ring-secondary/20 transition-all rounded-sm" placeholder="e.g. Premium Leather Bag" />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
              </div>
              <div className="flex flex-col gap-2" dir="rtl">
                <label className="text-sm font-semibold text-gray-600 text-right">العنوان (بالعربية)</label>
                <input {...register("title_ar")} className="w-full border px-3 py-2.5 text-right outline-none focus:ring-2 focus:ring-secondary/20 transition-all rounded-sm" placeholder="مثال: حقيبة جلدية فاخرة" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">Slug (Auto-generated)</label>
              <input {...register("slug")} className="w-full border bg-gray-50 px-3 py-2 text-gray-500 italic cursor-not-allowed rounded-sm" readOnly />
            </div>
          </div>

          {/* Section: Descriptions */}
          <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-700 border-b pb-2">Descriptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Description (English)</label>
                <textarea {...register("description")} className="w-full border px-3 py-2 min-h-[140px] outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm" />
              </div>
              <div className="flex flex-col gap-2" dir="rtl">
                <label className="text-sm font-semibold text-gray-600 text-right">الوصف (بالعربية)</label>
                <textarea {...register("description_ar")} className="w-full border px-3 py-2 text-right min-h-[140px] outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Section: Price & Stock */}
          <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-700 border-b pb-2">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Original Price</label>
                <input type="number" step="0.01" {...register("price")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Discount Price</label>
                <input type="number" step="0.01" {...register("discount_price")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">Stock Quantity</label>
                <input type="number" {...register("stock")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Section: Metadata */}
          <div className="bg-white p-6 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">SKU (Stock Keeping Unit)</label>
              <input {...register("sku")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Brand Name</label>
              <input {...register("brand")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm" />
            </div>
          </div>

          {/* Section: Dimensions */}
          <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-700">Shipping Dimensions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-bold uppercase">Weight (kg)</label>
                <input type="number" step="0.01" {...register("weight")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-bold uppercase">Length (cm)</label>
                <input type="number" step="0.01" {...register("length")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-bold uppercase">Width (cm)</label>
                <input type="number" step="0.01" {...register("width")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 font-bold uppercase">Height (cm)</label>
                <input type="number" step="0.01" {...register("height")} className="w-full border px-3 py-2 outline-none focus:ring-2 focus:ring-secondary/20" />
              </div>
            </div>
          </div>

          {/* Section: Category Selector */}
          <div className="bg-white p-6 border border-gray-100 shadow-sm">
            <CategorySelector />
          </div>

          {/* Section: Visibility */}
          <div className="flex items-center gap-3 p-5 bg-gray-50 border border-dashed border-gray-200">
            <input type="checkbox" {...register("is_active")} id="active-toggle" className="w-5 h-5 accent-secondary cursor-pointer" />
            <label htmlFor="active-toggle" className="font-semibold cursor-pointer text-gray-700">Activate product immediately in store</label>
          </div>

          {/* Section: MEDIA (Images & Videos) */}
          <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-12">
            
            {/* --- Image Upload Blocks --- */}
            <div className="space-y-8 border-b pb-10">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <ImageIcon size={20} className="text-secondary" /> Product Images
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Main Image */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-gray-600">Primary Image (Cover)</label>
                  <Input type="file" accept="image/*" className="bg-gray-50 border-gray-200" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setMainFile(file); setMainPreview(URL.createObjectURL(file)); }
                  }} />
                  {mainPreview && (
                    <div className="relative w-full aspect-square max-w-[200px] border-2 border-dashed rounded-lg p-2 bg-white shadow-sm mt-2">
                      <img src={mainPreview} className="w-full h-full object-contain" alt="Main" />
                      <button type="button" onClick={() => { setMainFile(null); setMainPreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-gray-600">Image Gallery (Multiple)</label>
                  <Input type="file" accept="image/*" multiple className="bg-gray-50 border-gray-200" onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    setGalleryFiles(files);
                    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                  }} />
                  <div className="flex gap-3 flex-wrap mt-2">
                    {galleryPreviews.map((src, i) => (
                      <div key={i} className="relative w-24 h-24 border rounded-md group bg-white shadow-xs">
                        <img src={src} className="w-full h-full object-contain p-1" alt="Gallery" />
                        <button type="button" onClick={() => {
                          setGalleryFiles(prev => prev.filter((_, idx) => idx !== i));
                          setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
                        }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Video Upload Blocks --- */}
            <div className="space-y-8">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Video size={20} className="text-secondary" /> Product Videos
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Main Video */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                     Main Video (Featured Clip)
                  </label>
                  <Input type="file" accept="video/*" className="bg-gray-50 border-gray-200" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setMainVideoFile(file); setMainVideoPreview(URL.createObjectURL(file)); }
                  }} />
                  {mainVideoPreview && (
                    <div className="relative w-full aspect-video border-2 border-dashed rounded-lg overflow-hidden bg-black shadow-md mt-2">
                      <video src={mainVideoPreview} className="w-full h-full" controls muted />
                      <button type="button" onClick={() => { setMainVideoFile(null); setMainVideoPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Video Gallery */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                    <Film size={14} /> Additional Video Gallery
                  </label>
                  <Input type="file" accept="video/*" multiple className="bg-gray-50 border-gray-200" onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    setVideoGalleryFiles(files);
                    setVideoGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                  }} />
                  <div className="flex gap-3 flex-wrap mt-2">
                    {videoGalleryPreviews.map((src, i) => (
                      <div key={i} className="relative w-36 aspect-video border rounded bg-black group overflow-hidden shadow-sm">
                        <video src={src} className="w-full h-full object-cover opacity-80" muted />
                        <button type="button" onClick={() => {
                          setVideoGalleryFiles(prev => prev.filter((_, idx) => idx !== i));
                          setVideoGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
                        }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit Action */}
          <div className="pt-10">
            <Button 
              type="submit" 
              className="bg-secondary hover:bg-secondary/90 w-full py-8 text-xl font-bold shadow-xl transition-all active:scale-[0.99] disabled:opacity-70 rounded-sm" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing Media & Publishing..." : "Publish Product to Marketplace"}
            </Button>
          </div>

        </form>
      </FormProvider>
    </div>
  );
}