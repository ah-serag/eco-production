"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/features/PreviewProduct/PreviewProductSlice";
import ProductPreview from "@/components/public/product_client";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SkeletonProductPreview from "@/components/public/skeletonProductPreview";

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useGetSingleProductQuery(slug, {
    skip: !slug, 
  });

  const product = data?.data; // استخراج المنتج من الرد (Response)

  // 1. حالة التحميل (Skeleton أو Spinner هادئ)
  if (isLoading) {
    return (
        <SkeletonProductPreview  />
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-4xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">عذراً، المنتج غير موجود</h1>
        <p className="text-slate-500 text-sm mb-6">ربما تم تغيير الرابط أو حذف المنتج من قبل الإدارة.</p>
        <Link href="/shop">
          <button className="flex items-center justify-center w-full h-11 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-black transition-all">
            <ArrowLeft size={16} className="mr-2" />
            العودة للتسوق
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] antialiased">
      {/* يمكن إضافة Breadcrumbs هنا للـ SEO وراحة المستخدم */}
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-[200px]">{product.title}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <ProductPreview product={product} />
      </main>
    </div>
  );
}