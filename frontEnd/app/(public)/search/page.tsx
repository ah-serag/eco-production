"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useLazySearchProductsQuery } from "@/redux/features/home/homeclientslice";
import ProductCard from "@/components/public/productCard";
import { Loader2, SearchX, ChevronLeft, ChevronRight } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);

  const [trigger, { data, isLoading, isFetching }] = useLazySearchProductsQuery();

  useEffect(() => {
    if (query) {
      trigger({ q: query, page, limit: 12 });
    }
  }, [query, page, trigger]);

  const products = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[oklch(53.679%_0.13515_245.014)] animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Searching for results...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex flex-col mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-black text-[#161f2d] tracking-tight uppercase">
          Search Results
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Showing results for: <span className="text-[oklch(53.679%_0.13515_245.014)] font-bold">"{query}"</span>
        </p>
      </div>

      {/* Products Grid - Using responsive grid columns */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed">
          <SearchX size={48} className="text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-[#161f2d]">No products found</h2>
          <p className="text-gray-400 text-sm mt-1">Try different keywords or check spelling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((product: any) => (
            // Added null check here as well for double safety
            product && <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-0">
          <button
            disabled={page === 1 || isFetching}
            onClick={() => {
              setPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 text-[#161f2d] font-bold text-sm hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={18} /> Previous
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold">
            <span className="text-[#161f2d]">{pagination.page}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">{pagination.totalPages}</span>
          </div>

          <button
            disabled={page === pagination.totalPages || isFetching}
            onClick={() => {
              setPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#161f2d] text-white font-bold text-sm hover:bg-[#161f2d]/90 disabled:opacity-30 transition-all"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Fetching Indicator */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-8 right-8 bg-white shadow-xl border border-gray-100 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-blue-600">
          <Loader2 size={14} className="animate-spin" />
          Updating Results...
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <SearchContent />
    </Suspense>
  );
}