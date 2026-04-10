"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "../public/productCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

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
  
  const subcategoryId  = section?.content[0]?.subcategory_id;
  const categoryId     = section?.content[0]?.category_id;
  const desktopImage   = section?.content[0]?.desktop_image_url;
  const mobileImage    = section?.content[0]?.mobile_image_url;
  const isImageRight   = section?.content[0]?.direct_image === true;
  const info = section?.info;
   
  const displayTitle = isArabic ? info?.title_ar : info?.title;
  const displaySubtitle = isArabic ? info?.subtitle_ar : info?.subtitle;

  const [page, setPage]           = useState(1);
  const [products, setProducts]   = useState<Product[]>([]);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtEnd, setIsAtEnd]     = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useGetProductsBySubcategoryQuery(
    { subcategoryId, page, limit: 12 },
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
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const vp = wrapper.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (!vp) return;
    const checkScroll = () => {
      setCanScroll(vp.scrollWidth > vp.clientWidth);
      setIsAtEnd(Math.abs(vp.scrollLeft) + vp.clientWidth >= vp.scrollWidth - 40);
    };
    checkScroll();
    vp.addEventListener("scroll", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(vp);
    return () => { vp.removeEventListener("scroll", checkScroll); ro.disconnect(); };
  }, [products]);

  if (!subcategoryId) return null;
   if(data?.data.length == 0){
    return ;
  }
  const hasMore = data?.pagination?.page < data?.pagination?.totalPages;

  return (
    <section 
      dir={isArabic ? "rtl" : "ltr"} 
      className="w-full bg-transparent border-none overflow-hidden my-4 group/section text-start"
    >
      
      <div className="flex  flex-col gap-0">

        {/* ── Banner + Title overlay ── */}
        {(desktopImage || mobileImage) && (
          <div className="group relative w-full aspect-4/2 md:aspect-4/1 overflow-hidden shrink-0">
            <img
              src={desktopImage || mobileImage!}
              alt="Promotion Banner"
              className="w-full h-full object-cover transition-transform duration-2000 ease-out group-hover:scale-105"
            />

            {/* gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            {/* title + cta */}
            {displayTitle && (
              <div
                className="absolute bottom-0 inset-x-0 px-4 pb-4 md:pb-5 flex flex-col gap-2"
                dir={isArabic ? "rtl" : "ltr"}

                
              >

                      <h2 className={`font-semibold text-white leading-tight drop-shadow-sm
                  ${isArabic ? "text-[16px] md:text-[30px]" : "text-[14px] md:text-[28px] uppercase tracking-wide"}`}>
                  {displayTitle}
                </h2>
                {displaySubtitle && (
                  <span className={`text-white/50 font-normal tracking-[0.25em] uppercase
                    ${isArabic ? "text-[9px] md:text-[10px]" : "text-[8px] md:text-[9px]"}`}>
                    {displaySubtitle}
                  </span>
                )}
          

                {categoryId && (
                  <Link
                    href={`/products/${categoryId}?sub=${subcategoryId}`}
                    className={`self-start mt-1 inline-flex items-center gap-2
                      text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium
                      text-white/80 hover:text-white transition-colors duration-200
                      border-b border-white/30 hover:border-white/80 pb-0.5`}
                  >
                    {isArabic ? "تسوق الآن" : "Shop Now"}
                    <span className={`text-[10px] ${isArabic ? "rotate-180" : ""}`}>→</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Products ── */}
        <div ref={wrapperRef} className="relative w-full">

          {/* scroll arrow — يختفي لما العميل يوصل للآخر */}
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

          <ScrollArea dir={isArabic ? "rtl" : "ltr"} className="w-full">
            <div className="flex gap-3 md:gap-4 px-4 py-4 w-max items-stretch">
              {products.map((product: any, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="w-[145px] md:w-[190px] shrink-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}

              {hasMore && (
                <div className="flex items-center justify-center px-4">
                  <button
                    disabled={isFetching}
                    onClick={() => setPage((prev) => prev + 1)}
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
            <ScrollBar orientation="horizontal" className="h-1.5 bg-slate-100 [&>div]:bg-slate-300 [&>div]:rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity duration-300" />
          </ScrollArea>
        </div>


      </div>
    </section>
  );
}