"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useLazySearchProductsQuery } from "@/redux/features/home/homeclientslice";
import ProductCard from "@/components/public/productCard";
import { Loader2, SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import ProductCardSkeleton from "@/components/public/ProductCardSkeleton";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

function SearchContent() {
  const t = useTranslations("search");
  const locale = useLocale();
  const isAr = locale === "ar";

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);

  const [trigger, { data, isLoading, isFetching }] = useLazySearchProductsQuery();

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (query) {
      trigger({ q: query, page, limit: 24 });
    }
  }, [query, page, trigger]);

  const products = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const PrevIcon = isAr ? ChevronRight : ChevronLeft;
  const NextIcon = isAr ? ChevronLeft : ChevronRight;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }


  return (
    <div dir={isAr ? "rtl" : "ltr"} className="container mx-auto py-4 pb-20 px-4">
      {/* Header Section */}
      <div className="flex flex-col mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-xl font-semibold text-[#161f2d] tracking-tight uppercase">
          {t("title")}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {t("subtitle")} : <span className="text-[oklch(53.679%_0.13515_245.014)] font-bold">{query}</span>
        </p>
      </div>

      {/* Products Grid */}
      <div className={`relative transition-all duration-500 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed">
            <SearchX size={48} className="text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-[#161f2d]">{t("empty_title")}</h2>
            <p className="text-gray-400 text-sm mt-1">{t("empty_sub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {products.map((product: any) => (
              product && <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-16 mb-8 flex justify-center" dir={isAr ? "rtl" : "ltr"}>
          <Pagination className="w-auto">
            <PaginationContent className="gap-1.5">

              <PaginationItem>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-100 bg-white shadow-sm text-neutral-500 hover:text-chart-1 disabled:opacity-20 transition-all"
                >
                  <PrevIcon size={14} />
                </button>
              </PaginationItem>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum === 1 || pageNum === pagination.totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={page === pageNum}
                        className={cn(
                          "w-8 h-8 rounded-full text-[11px] font-bold cursor-pointer transition-all duration-300 border",
                          page === pageNum
                            ? "bg-chart-1 text-white border-chart-1 shadow-md shadow-chart-1/30 scale-105"
                            : "bg-white text-neutral-500 border-neutral-100 shadow-sm hover:border-neutral-300 hover:text-black"
                        )}
                      >
                        {pageNum.toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis className="text-neutral-300 w-8 h-8 flex items-center justify-center scale-75" />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-100 bg-white shadow-sm text-neutral-500 hover:text-chart-1 disabled:opacity-20 transition-all"
                >
                  <NextIcon size={14} />
                </button>
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Fetching Indicator */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-8 right-8 bg-white shadow-xl border border-gray-100 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-blue-600">
          <Loader2 size={14} className="animate-spin" />
          {t("updating")}
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
