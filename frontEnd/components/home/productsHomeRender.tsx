"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetProductsByCategoryQuery } from "../../redux/features/home/homeclientslice";
import ProductCardHome from "../public/CardHome";
import { useLocale } from "next-intl"; 

interface Product {
  id: number;
  title: string;
  price: number;
  discount_price?: number;
  image_url: string;
}

export default function ProductsHomeCarouselPro({ section }: any) {
  const locale = useLocale(); 
  const categoryId = section?.content?.[0]?.category_id || null;

if (!categoryId || section.content.length === 0) {
  return null; 
}
  const info = section?.info;

  const isArabic = locale === "ar";
  const displayTitle = isArabic ? info?.title_ar : info?.title;
  const displaySubtitle = isArabic ? info?.subtitle_ar : info?.subtitle;

  const [page, setPage]           = useState(1);
  const [products, setProducts]   = useState<Product[]>([]);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtEnd, setIsAtEnd]     = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const limit = 10;

  const { data, isLoading, isFetching, isUninitialized } = useGetProductsByCategoryQuery(
    { categoryId, page, limit },
    { skip: !categoryId }
  );

  useEffect(() => {
    if (data?.data) setProducts(data.data);
  }, [data, page]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const vp = wrapper.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (!vp) return;
    const check = () => {
      setCanScroll(vp.scrollWidth > vp.clientWidth);
      setIsAtEnd(Math.abs(vp.scrollLeft) + vp.clientWidth >= vp.scrollWidth - 40);
    };
    check();
    vp.addEventListener("scroll", check);
    const ro = new ResizeObserver(check);
    ro.observe(vp);
    return () => { vp.removeEventListener("scroll", check); ro.disconnect(); };
  }, [products]);

  if (!categoryId) return null;

  const totalPages = data?.pagination?.totalPages ?? 1;

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <section className="relative bg-transparent  py-2 group/section">
      
      {/* ===== Header ===== */}
      {displayTitle && (
        <div className="px-4 mb-4 flex items-end justify-between">
          <div className="flex flex-col gap-0.5 text-start">
            <h2 className={`font-normal text-gray-900 tracking-tight ${
              isArabic ? "text-[18px] md:text-[24px] leading-tight" : "text-[16px] md:text-[20px]"
            }`}>
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <span className={`font-normal uppercase text-slate-400 ${
                isArabic ? "text-[11px] md:text-[13px] tracking-normal" : "text-[9px] md:text-[10px] tracking-[0.25em]"
              }`}>
                {displaySubtitle}
              </span>
            )}
          </div>

          {/* ===== Controls ===== */}
          {!isUninitialized && totalPages > 1 && (
            <div className="flex items-center gap-1.5" dir="ltr">
              <button
                onClick={isArabic ? handleNext : handlePrev}
                disabled={(isArabic ? page === totalPages : page === 1) || isFetching}
                className="group p-1.5 rounded-full border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-20 transition-all duration-300 shadow-none"
              >
                <ChevronLeft size={15} className="text-gray-400 group-active:scale-75 transition-transform" />
              </button>
              
              <button
                onClick={isArabic ? handlePrev : handleNext}
                disabled={(isArabic ? page === 1 : page === totalPages) || isFetching}
                className="group p-1.5 rounded-full border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-20 transition-all duration-300 shadow-none"
              >
                <ChevronRight size={15} className="text-gray-400 group-active:scale-75 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}

      <div ref={wrapperRef} className="relative">
        {canScroll && !isAtEnd && (
          <div className={`absolute top-0 bottom-3 z-10 flex items-center pointer-events-none
            ${isArabic ? "left-0" : "right-0"}`}>
            <div className={`h-full w-20
              ${isArabic ? "bg-linear-to-r from-white to-transparent" : "bg-linear-to-l from-white to-transparent"}`} />
            <button
              onClick={() => {
                const vp = wrapperRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
                vp?.scrollBy({ left: isArabic ? -280 : 280, behavior: "smooth" });
              }}
              style={{ [isArabic ? "left" : "right"]: "10px" }}
              className="absolute pointer-events-auto top-1/2 -translate-y-1/2
                w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md
                flex items-center justify-center text-slate-500
                hover:bg-neutral-900 hover:text-white hover:border-neutral-900
                transition-all duration-200 active:scale-90"
            >
              {isArabic ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>
        )}

        <ScrollArea dir={isArabic ? "rtl" : "ltr"} className="w-full whitespace-nowrap overflow-hidden">
        <div className="flex gap-1 md:gap-3 px-6 pb-6">
          {isLoading || isFetching ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="w-[140px] md:w-[200px] aspect-3/4 rounded-xl bg-gray-50/50 animate-pulse shrink-0 border border-slate-50" 
              />
            ))
          ) : (
            products.map((product: any, index) => (
              <div 
                key={`${product.id}-${index}`}
                className={`p-1 md:p-3 transition-all duration-700 ease-out transform
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
      </div>
    </section>
  );
}