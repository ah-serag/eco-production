"use client";

import { useEffect, useState } from "react";
import ProductCard from "../public/productCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useLocale } from "next-intl"; 

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
  const locale = useLocale();
  const isArabic = locale === "ar";
  
  const subcategoryId = section?.content[0]?.subcategory_id;
  const bannerImage = section?.content[0]?.image_url;
  const isImageRight = section?.content?.direct_image === true;
  const info = section?.info;
   
  const displayTitle = isArabic ? info?.title_ar : info?.title;
  const displaySubtitle = isArabic ? info?.subtitle_ar : info?.subtitle;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        const scrollAmount = isArabic ? -40 : 40;
        viewport.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        setTimeout(() => {
          viewport.scrollTo({ left: 0, behavior: 'smooth' });
        }, 500);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isArabic]);

  if (!subcategoryId) return null;
   if(data?.data.length == 0){
    return ;
  }
  const hasMore = data?.pagination?.page < data?.pagination?.totalPages;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"} 
      className="w-full bg-transparent border border-gray-100  overflow-hidden my-4 group/section text-start"
    >
      
      {/* ===== Header ===== */}
      {displayTitle && (
        <div className="pt-6 px-4 flex flex-col gap-0.5">
          <h2 className={`font-normal text-gray-900 tracking-tight leading-none ${
            isArabic ? "text-[18px] md:text-[24px]" : "text-[16px] md:text-[20px]"
          }`}>
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <span className={`font-normal uppercase mt-1 text-slate-400 ${
              isArabic ? "text-[10px] md:text-[12px] tracking-normal" : "text-[8px] md:text-[9px] tracking-[0.3em]"
            }`}>
              {displaySubtitle}
            </span>
          )}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch mt-4">
        
        {bannerImage && (
          <div
            className={`
              lg:col-span-4 relative w-full min-h-[300px] lg:min-h-full
              overflow-hidden group p-4 md:p-6
              ${isImageRight ? "lg:order-2" : "lg:order-1"}
            `}
          >
            <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] bg-gray-50/50">
                <img
                src={bannerImage}
                alt="Promotion Banner"
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
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
          <ScrollArea dir={isArabic ? "rtl" : "ltr"} className="w-full">
            <div className="flex gap-4 md:gap-6 px-6 py-8 w-max items-stretch">
              {products.map((product : any, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className="w-[150px] md:w-[210px] shrink-0 transition-all duration-500 ease-out"
                >
                  <ProductCard product={product} />
                </div>
              ))}

              {/* View More Button */}
              {hasMore && (
                <div className="flex items-center justify-center px-6">
                  <button
                    disabled={isFetching}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="group flex flex-col items-center gap-3 transition-all active:scale-95"
                  >
                    <div className="w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-500 transition-all group-hover:bg-black group-hover:text-white group-hover:border-black group-hover:shadow-md">
                      {isFetching ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        isArabic ? (
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        ) : (
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        )
                      )}
                    </div>
                    <span className="text-[10px] font-normal uppercase tracking-[0.1em] text-gray-400 group-hover:text-black transition-colors">
                      {isFetching ? (isArabic ? "تحميل" : "Loading") : (isArabic ? "المزيد" : "More")}
                    </span>
                  </button>
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" className="h-1.5 opacity-0 group-hover/section:opacity-100 transition-opacity" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}