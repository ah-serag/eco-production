"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetProductsByCategoryQuery } from "../../redux/features/home/homeclientslice";
import ProductCardHome from "../public/CardHome";
import { useLocale } from "next-intl";

interface Product {
  id: number;
  title: string;
  title_ar?: string;
  price: number;
  discount_price: number;
  description?: string;
  description_ar?: string;
  image_url: string;
  stock: number;
  slug: string;
}

export default function ProductsHomeCarouselPro({ section }: any) {
  const locale     = useLocale();
  const categoryId = section?.content?.[0]?.category_id || null;

  if (!categoryId || section.content.length === 0) return null;

  const info            = section?.info;
  const isArabic        = locale === "ar";
  const displayTitle    = isArabic ? info?.title_ar    : info?.title;
  const displaySubtitle = isArabic ? info?.subtitle_ar : info?.subtitle;

  const [page, setPage]           = useState(1);
  const [products, setProducts]   = useState<Product[]>([]);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtEnd, setIsAtEnd]     = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetProductsByCategoryQuery(
    { categoryId, page, limit },
    { skip: !categoryId }
  );

  useEffect(() => {
    if (data?.data) {
      setProducts(prev => page === 1 ? data.data : [...prev, ...data.data]);
    }
  }, [data, page]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const vp = wrapper.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (!vp) return;
    const check = () => {
      setCanScroll(vp.scrollWidth > vp.clientWidth);
      setIsAtEnd(Math.abs(vp.scrollLeft) + vp.clientWidth >= vp.scrollWidth - 40);
      setIsAtStart(Math.abs(vp.scrollLeft) < 10);
    };
    check();
    vp.addEventListener("scroll", check);
    const ro = new ResizeObserver(check);
    ro.observe(vp);
    return () => { vp.removeEventListener("scroll", check); ro.disconnect(); };
  }, [products]);

  const hasMore = data?.pagination?.page < data?.pagination?.totalPages;

  return (
    <section className="relative bg-transparent  py-2 group/section">

      {/* Header */}
      {displayTitle && (
        <div className={`relative mb-4  py-4 bg-slate-50 p-2 border border-neutral-100  flex items-center justify-between gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>

          {/* title + subtitle */}
          <div className={`flex flex-col gap-1 ${isArabic ? "items-end" : "items-start"}`}>
            <h2 className={`font-semibold  text-primary leading-none ${
              isArabic ? "text-[18px] md:text-[22px]" : "text-[15px] md:text-[18px] uppercase tracking-wide"
            }`}>
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
                {displaySubtitle}
              </span>
            )}
          </div>

          {/* decorative dots */}
          <div className={`hidden md:flex items-center gap-1.5 ${isArabic ? "flex-row-reverse" : ""}`}>
            {[1,2,3].map(i => (
              <span key={i} className="w-1 h-1 rounded-full bg-slate-200" style={{ opacity: 1 - i * 0.25 }} />
            ))}
          </div>

        </div>
      )}

      <div ref={wrapperRef} className="relative">

        {/* سهم الرجوع — ديسكتوب فقط */}
        {canScroll && !isAtStart && (
          <div className={`hidden md:flex absolute top-0 bottom-3 z-10 items-center pointer-events-none
            ${isArabic ? "right-0" : "left-0"}`}>
            <div className={`h-full w-20
              ${isArabic ? "bg-linear-to-l from-white to-transparent" : "bg-linear-to-r from-white to-transparent"}`} />
            <button
              onClick={() => {
                const vp = wrapperRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
                vp?.scrollBy({ left: isArabic ? 280 : -280, behavior: "smooth" });
              }}
              style={{ [isArabic ? "right" : "left"]: "10px" }}
              className="absolute pointer-events-auto top-1/2 -translate-y-1/2
                w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md
                flex items-center justify-center text-slate-500
                hover:bg-neutral-900 hover:text-white hover:border-neutral-900
                transition-all duration-200 active:scale-90"
            >
              {isArabic ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>
        )}

        {/* سهم الأمام */}
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
          <div className="flex gap-1 md:gap-3 px-3 pb-6">
            {isLoading || (isFetching && page === 1) ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[140px] md:w-[200px] aspect-3/4 rounded-xl bg-gray-50/50 animate-pulse shrink-0 border border-slate-50" />
              ))
            ) : (
              products.map((product: any, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="w-[140px] md:w-[200px] shrink-0 transition-all duration-700 ease-out opacity-100"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <ProductCardHome product={product} />
                </div>
              ))
            )}

            {/* More button */}
            {hasMore && (
              <div className="flex items-center justify-center px-4">
                <button
                  disabled={isFetching}
                  onClick={() => setPage(prev => prev + 1)}
                  className="group flex flex-col items-center gap-2 transition-all active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full border border-slate-100 bg-white flex items-center justify-center text-slate-400 transition-all group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900">
                    {isFetching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isArabic ? (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-slate-400 group-hover:text-neutral-800 transition-colors">
                    {isFetching ? (isArabic ? "تحميل" : "Loading") : (isArabic ? "المزيد" : "More")}
                  </span>
                </button>
              </div>
            )}
          </div>

          <ScrollBar orientation="horizontal" className="h-1.5 transition-opacity duration-300 opacity-0 group-hover/section:opacity-100" />
        </ScrollArea>
      </div>
    </section>
  );
}
