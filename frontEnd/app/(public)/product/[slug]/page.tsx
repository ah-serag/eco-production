"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/features/PreviewProduct/PreviewProductSlice";
import ProductPreview from "@/components/public/product_client";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SkeletonProductPreview from "@/components/public/skeletonProductPreview";

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug;
  
  const { 
    data, 
    isLoading, 
    isError 
  } = useGetSingleProductQuery(slug, {
    skip: !slug, 
  });

  const product = data?.data;

  // Handle Loading State with Skeleton
  if (isLoading) {
    return (
        <SkeletonProductPreview />
    );
  }

  // Handle Error or Missing Product State
  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm antialiased">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Product Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">
          The link might be broken or the product has been removed from our catalog.
        </p>
        <Link href="/products">
          <button className="flex items-center justify-center w-full h-11 bg-chart-1 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-105 transition-all gap-2">
            <ArrowLeft size={16} />
            Back to Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] antialiased">
      {/* Breadcrumbs for SEO and Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-chart-1 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/products/${product.category_id}`} className="hover:text-chart-1 transition-colors">Shop</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 truncate max-w-[150px] md:max-w-full italic font-medium lowercase">
            {product.title}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        {/* The ProductPreview now handles the stock logic internally */}
        <ProductPreview product={product} />
      </main>
    </div>
  );
}