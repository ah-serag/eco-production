"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategorySelector from "@/components/public/CategorySelector";
import { toast } from "sonner";
import { FileCheck, FileX, PackagePlus  } from "lucide-react";
import { productSchema } from "@/lib/zodSchema";
import { useAddProductWithImagesMutation } from "../../redux/features/productAdmin/productapiSlice";

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProduct() {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      description: "",
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

  // Auto-generate slug
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

      // Use RTK Query mutation
      const result: any = await addProduct(formData).unwrap();

      toast.success(`Product created successfully! Product ID: ${result.product_id}`, { icon: <FileCheck /> });

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
      <div className="w-full mx-auto   space-y-6">
      <div className="relative overflow-hidden mb-10  rounded-md p-10  bg-secondary text-white">

  {/* المحتوى */}
  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    
    {/* أيقونة ونص */}
     <div className="flex items-start md:items-center gap-4 md:gap-6 max-w-xl">

          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-chart-1">
        <PackagePlus  className="w-8 h-8" />
     </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Add New Product</h2>
        <p className="text-sm text-gray-300">
          Easily add new products to your store. Fill in the details including title, description, price, stock, images, and categories.
        </p>
        <p className="text-sm text-gray-400">
          Make sure all required fields are filled and images are uploaded.
        </p>
      </div>
    </div>

  </div>
</div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input {...register("title")} className="w-full border rounded-lg px-3 py-2" />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Slug</label>
                <input {...register("slug")} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea {...register("description")} className="w-full border rounded-lg px-3 py-2 min-h-[100px]" />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input type="number" step="0.01" {...register("price")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Discount Price</label>
                <input type="number" step="0.01" {...register("discount_price")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Stock</label>
                <input type="number" {...register("stock")} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            {/* SKU & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">SKU</label>
                <input {...register("sku")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Brand</label>
                <input {...register("brand")} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label>Weight</label>
                <input type="number" step="0.01" {...register("weight")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label>Length</label>
                <input type="number" step="0.01" {...register("length")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label>Width</label>
                <input type="number" step="0.01" {...register("width")} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label>Height</label>
                <input type="number" step="0.01" {...register("height")} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            {/* Category */}
            <CategorySelector />

            {/* Active */}
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("is_active")} />
                <span>Active</span>
              </label>
            </div>

            {/* Main Image */}
            <div>
              <label className="block mb-1 font-medium">Main Image</label>
              <Input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setMainFile(file);
                  setMainPreview(URL.createObjectURL(file));
                }
              }} />
              {mainPreview && (
                <div className="relative w-48 h-48 mt-2 rounded-lg overflow-hidden shadow-lg">
                  <img src={mainPreview} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setMainFile(null); setMainPreview(null); }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div>
              <label className="block mb-1 font-medium">Gallery Images</label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  setGalleryFiles(files);
                  setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                }}
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {galleryPreviews.map((src, i) => (
                  <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
                    <img src={src} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = [...galleryFiles];
                        const newPreviews = [...galleryPreviews];
                        newFiles.splice(i, 1);
                        newPreviews.splice(i, 1);
                        setGalleryFiles(newFiles);
                        setGalleryPreviews(newPreviews);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className=" bg-secondary hover:bg-secondary/90 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Product"}
            </Button>

          </form>
        </FormProvider>
      </div>
  );
}
