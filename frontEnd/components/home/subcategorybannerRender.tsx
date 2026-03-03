"use client";

import { useEffect, useState } from "react";
import ProductCard from "../public/productCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useGetProductsBySubcategoryQuery,
} from "../../redux/features/home/homeclientslice";

interface Product {
  id: number;
  title: string;
  price: number;
  discount_price?: number;
  description?: string;
  image_url: string;
  rating?: number;
  qty?: number;
}

export default function SubcategoryBannerRender({ section }: any) {
  const subcategoryId = section?.content[0]?.subcategory_id;
  const bannerImage = section?.content[0]?.image_url;
  const isImageRight = section?.content?.direct_image === true;
  const info = section?.info;

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);

  const { data, isFetching } = useGetProductsBySubcategoryQuery(
    { subcategoryId, page, limit: 6 },
    { skip: !subcategoryId }
  );

  useEffect(() => {
    if (data?.data) {
      setProducts((prev) =>
        page === 1 ? data.data : [...prev, ...data.data]
      );
    }
  }, [data, page]);

  // تأثير الـ Hint Scroll للهاتف ليبين أن هناك المزيد من المنتجات بجانب الـ Banner
  useEffect(() => {
    const timer = setTimeout(() => {
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ left: 40, behavior: 'smooth' });
        setTimeout(() => {
          viewport.scrollTo({ left: 0, behavior: 'smooth' });
        }, 500);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!subcategoryId) return null;

  const hasMore = data?.pagination?.page < data?.pagination?.totalPages;

  return (
    <section className="w-full bg-transparent border border-gray-100 rounded-[2.5rem] overflow-hidden my-4 group/section">
      
      {/* ===== Minimal Header - موحد مع باقي الموقع ===== */}
      {info?.title && (
        <div className="pt-6 px-8 flex flex-col gap-0.5">
          <h2 className="text-[16px] md:text-[20px] font-semibold text-gray-900 tracking-tight leading-none">
            {info.title}
          </h2>
          {info.subtitle && (
            <span className="text-[8px] md:text-[9px]  font-medium uppercase tracking-[0.3em] mt-1">
              {info.subtitle}
            </span>
          )}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch mt-4">
        
        {/* Banner Section - تصميم أكثر فخامة */}
        {bannerImage && (
          <div
            className={`
              lg:col-span-4 relative w-full min-h-[300px] lg:min-h-full
              overflow-hidden group p-4 md:p-6
              ${isImageRight ? "lg:order-2" : "lg:order-1"}
            `}
          >
            <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] bg-gray-50">
                <img
                src={bannerImage}
                alt="Promotion Banner"
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>
        )}

        {/* Products Scroll Area */}
        <div
          className={`
            lg:col-span-8 w-full bg-transparent flex items-center
            ${isImageRight ? "lg:order-1" : "lg:order-2"}
          `}
        >
          <ScrollArea className="w-full">
            <div className="flex gap-4 md:gap-6 px-6 py-8 w-max items-stretch">
              {products.map((product : any, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  // عرض 150px في الموبايل يضمن ظهور طرف المنتج التالي بجانب البانر
                  className="w-[150px] md:w-[210px] shrink-0 transition-all duration-500 ease-out"
                >
                  <ProductCard product={product} />
                </div>
              ))}

              {/* View More Button - Minimalist Style */}
              {hasMore && (
                <div className="flex items-center justify-center px-6">
                  <button
                    disabled={isFetching}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="group flex flex-col items-center gap-3 transition-all active:scale-95"
                  >
                    <div className="w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-900 transition-all group-hover:bg-black group-hover:text-white group-hover:shadow-md">
                      {isFetching ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-gray-400 group-hover:text-black transition-colors">
                      {isFetching ? "Loading" : "More"}
                    </span>
                  </button>
                </div>
              )}
            </div>
            {/* السكرول بار يظهر فقط عند الـ Hover */}
            <ScrollBar orientation="horizontal" className="h-1.5 opacity-0 group-hover/section:opacity-100 transition-opacity" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}