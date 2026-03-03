"use client";

import { useEffect, useState, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null); // مرجع للتحكم في السكرول
  const limit = 10; 

  const { data, isLoading, isFetching, isUninitialized } = useGetProductsByCategoryQuery(
    { categoryId, page, limit },
    { skip: !categoryId }
  );

  useEffect(() => {
    if (data?.data) {
      setProducts(data.data);
      
   
    }
  }, [data, page]);

  if (!categoryId) return null;

  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <section className="relative bg-transparent border-b border-gray-100 py-2 group/section">
      
      {/* ===== Header ===== */}
      {info?.title && (
        <div className="px-6 mb-4 flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[14px] md:text-[20px] font-semibold text-gray-900 tracking-tight">
              {info.title}
            </h2>
            {info.subtitle && (
              <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.25em]">
                {info.subtitle}
              </span>
            )}
          </div>

          {/* ===== Controls ===== */}
          {!isUninitialized && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="group p-1.5 rounded-full border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-20 transition-all duration-300"
              >
                <ChevronLeft size={15} className="text-gray-500 group-active:scale-75 transition-transform" />
              </button>
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isFetching}
                className="group p-1.5 rounded-full border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-20 transition-all duration-300"
              >
                <ChevronRight size={15} className="text-gray-500 group-active:scale-75 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}

      <ScrollArea className="w-full whitespace-nowrap overflow-hidden">
        <div className="flex gap-1 md:gap-3 px-6 pb-6">
          {isLoading || isFetching ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="w-[140px] md:w-[200px] aspect-3/4 rounded-xl bg-gray-100/50 animate-pulse shrink-0" 
              />
            ))
          ) : (
            products.map((product: any, index) => (
              <div 
                key={`${product.id}-${index}`}
                className={` p-3 transition-all duration-700 ease-out transform
                           ${isFetching ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <ProductCardHome product={product} />
              </div>
            ))
          )}
        </div>
        
        <ScrollBar 
          orientation="horizontal" 
          className="h-1.5 transition-opacity duration-300 opacity-0 group-hover/section:opacity-100" 
        />
      </ScrollArea>
    </section>
  );
}