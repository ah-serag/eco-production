"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/features/PreviewProduct/PreviewProductSlice";
import ProductPreview from "@/components/public/product_client";
import { AlertCircle, ArrowLeft } from "lucide-react";
import SkeletonProductPreview from "@/components/public/skeletonProductPreview";
import { useLocale } from "next-intl"; 
import { Link } from "@/i18n/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const locale = useLocale();
  const slug = params?.slug;

  const isArabic = locale === "ar"; 

  const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
    skip: !slug,
  });

  const product = data?.data;

  if (isLoading) return <SkeletonProductPreview />;

  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm antialiased">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          {isArabic ? "المنتج غير موجود" : "Product Not Found"}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {isArabic ? "هذا المنتج غير متوفر حالياً." : "The product is currently unavailable."}
        </p>
        <Link href="/products">
          <button className="flex items-center justify-center w-full h-11 bg-secondary text-white rounded-xl text-xs font-bold uppercase tracking-widest gap-2">
            <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} />
            {isArabic ? "العودة للتسوق" : "Back to Shopping"}
          </button>
        </Link>
      </div>
    );
  }

  const currentTitle = isArabic ? (product.title_ar || product.title) : product.title;

  return (
    <div className="min-h-screen bg-[#FCFCFC] antialiased">
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div 
          className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest"
          style={{ direction: isArabic ? 'rtl' : 'ltr' }}
        >
          <Link href="/" className="hover:text-secondary transition-colors">
            {isArabic ? "الرئيسية" : "Home"}
          </Link>
          <span className="text-slate-300">/</span>
          <Link href={`/products/${product.category_id}`} className="hover:text-secondary transition-colors">
            {isArabic ? "المتجر" : "Shop"}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 truncate max-w-[150px] md:max-w-full italic font-medium lowercase">
            {currentTitle}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <ProductPreview product={product} />
      </main>
    </div>
  );
}