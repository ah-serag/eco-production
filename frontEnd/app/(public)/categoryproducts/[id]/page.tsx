"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useGetProductsByCategoryQuery } from "../../../../redux/features/home/homeclientslice";
import ProductCard from "@/components/public/productCard";
import { Loader2 } from "lucide-react";
import ProductCardSkeleton from "@/components/public/ProductCardSkeleton";

export default function CategoryPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const limit = 12; 

  const { data, isLoading, isFetching } = useGetProductsByCategoryQuery({
    categoryId: id,
    page,
    limit,
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        {/* Title Skeleton */}
        <div className="mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-1 w-20 bg-gray-200 mt-2 rounded-full animate-pulse" />
        </div>

        {/* Skeleton Grid (نفس تنسيق الجريد الأصلي) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">


      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((product: any) => (
            product && <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            disabled={page === 1 || isFetching}
            onClick={() => {
              setPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2 border border-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            Prev
          </button>

          <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg font-bold text-xs">
            <span className="text-cyan-800">{pagination.page}</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500">{pagination.totalPages}</span>
          </div>

          <button
            disabled={page === pagination.totalPages || isFetching}
            onClick={() => {
              setPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2 bg-[#161f2d] text-white rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* Loading indicator for pagination (Small popup) */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-5 right-5 bg-white shadow-lg border border-gray-100 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-cyan-800 z-50">
          <Loader2 size={14} className="animate-spin" />
          Updating...
        </div>
      )}
    </div>
  );
}