"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useSearchProductscatAndsubQuery } from "@/redux/features/home/homeclientslice";
import ProductCard from "@/components/public/productCard";
import ProductCardSkeleton from "@/components/public/ProductCardSkeleton";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export default function SearchProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isAr = locale === "ar";

  const [page, setPage] = useState(1);
  const limit = 25;

  const categoryId = params?.categoryId as string;
  const subQuery = searchParams.get("sub") || undefined;

  const filters = useMemo(() => ({
    category: categoryId,
    subcategory: subQuery, 
    page,
    limit,
    price_min: searchParams.get("price_min") || undefined,
    price_max: searchParams.get("price_max") || undefined,
    rating: searchParams.get("rating") || undefined,
  }), [categoryId, subQuery, searchParams, page]);

  useEffect(() => {
    setPage(1);
  }, [categoryId, subQuery, searchParams]);

  const { data, isLoading, isFetching } = useSearchProductscatAndsubQuery(filters, {
    skip: !categoryId || categoryId === "undefined",
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const PrevIcon = isAr ? ChevronRight : ChevronLeft;
  const NextIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <>
      <div className={`relative transition-all duration-500 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
        {products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-400 text-sm">{isAr ? "لم يتم العثور على منتجات." : "No products found."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 pb-2 pl-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-2" 
           style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
          >
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

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

  
    </>
  );
}