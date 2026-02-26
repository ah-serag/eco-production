"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetProductsByCategoryQuery } from "../../redux/features/home/homeclientslice";
import ProductCardHome from "../public/CardHome";

interface Product {
  id: number;
  title: string;
  price: number;
  discount_price?: number;
  image_url: string;
}

export default function ProductsHomeCarouselPro({ section }: any) {
  const categoryId = section?.content[0].category_id;
  const info = section?.info;

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const limit = 10; 

  const { data, isLoading, isFetching, isUninitialized } = useGetProductsByCategoryQuery(
    { categoryId, page, limit },
    { skip: !categoryId }
  );

  useEffect(() => {
    if (data?.data) setProducts(data.data);
  }, [data]);

  if (!categoryId) return null;

  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <section className="relative bg-white border-y p-1 border  rounded-3xl border-gray-100">
      
      {/* ===== Minimal Header الموحد والمعدل ===== */}
      {info?.title && (
        <div className="py-6 px-6 flex items-center justify-between bg-white">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">
              {info.title}
            </h2>

            {info.subtitle && (
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-gray-200">|</span>
                <span className="text-xs md:text-sm font-normal uppercase tracking-[0.2em]">
                  {info.subtitle}
                </span> 
              </div>
            )}
          </div>

          {/* ===== Minimal Controls ===== */}
          {!isUninitialized && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="p-2 rounded-full hover:bg-gray-50 disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isFetching}
                className="p-2 rounded-full hover:bg-gray-50 disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          )}
        </div>
      )}

      <ScrollArea className="w-full">
        <div className="flex gap-4 md:gap-6 px-6 pb-10 w-max mx-auto items-center">
          {isLoading || isFetching ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[180px] md:w-[220px] aspect-3/4 rounded-2xl bg-gray-50 animate-pulse" />
            ))
          ) : (
            products.map((product: any, index) => (
              <div key={index} className="shrink-0 p-2 transition-opacity duration-300">
                <ProductCardHome product={product} />
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </section>
  );
}