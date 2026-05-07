"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategorySection({ section }: any) {
  const locale     = useLocale();
  const isAr       = locale === "ar";
  const categories = (section?.content ?? []).filter((cat: any) => cat?.category_id);
  const info       = section?.info;

  const wrapperRef  = useRef<HTMLDivElement>(null);

  // ← نفس نظام ProductsHomeCarouselPro بالظبط
  const [canScroll, setCanScroll] = useState(false);
  const [isAtEnd,   setIsAtEnd]   = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);

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
  }, [categories]);

  if (categories.length === 0) return null;

  const sectionTitle    = isAr ? info?.title_ar    : info?.title;
  const sectionSubtitle = isAr ? info?.subtitle_ar : info?.subtitle;

  return (
    <section className="" dir={isAr ? "rtl" : "ltr"}>

      {sectionTitle && (
        <div className="relative  flex py-4 bg-slate-50 p-2 border border-neutral-100 items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className={`font-semibold text-primary leading-none ${
              isAr ? "text-[18px] md:text-[22px]" : "text-[15px] md:text-[18px] uppercase tracking-wide"
            }`}>
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
                {sectionSubtitle}
              </span>
            )}
          </div>
        </div>
      )}

      <div ref={wrapperRef} className="relative">

        {/* سهم الرجوع — ديسكتوب فقط، نفس ProductsHomeCarouselPro */}
        {canScroll && !isAtStart && (
          <div className={`hidden md:flex absolute top-0 bottom-3 z-10 items-center pointer-events-none
            ${isAr ? "right-0" : "left-0"}`}>
            <div className={`h-full w-20
              ${isAr ? "bg-linear-to-l from-white to-transparent" : "bg-linear-to-r from-white to-transparent"}`} />
            <button
              onClick={() => {
                const vp = wrapperRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
                vp?.scrollBy({ left: isAr ? 280 : -280, behavior: "smooth" });
              }}
              style={{ [isAr ? "right" : "left"]: "10px" }}
              className="absolute pointer-events-auto top-1/2 -translate-y-1/2
                w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md
                flex items-center justify-center text-slate-500
                hover:bg-neutral-900 hover:text-white hover:border-neutral-900
                transition-all duration-200 active:scale-90"
            >
              {isAr ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>
        )}

        {/* سهم الأمام — نفس ProductsHomeCarouselPro */}
        {canScroll && !isAtEnd && (
          <div className={`absolute top-0 bottom-3 z-10 flex items-center pointer-events-none
            ${isAr ? "left-0" : "right-0"}`}>
            <div className={`h-full w-20
              ${isAr ? "bg-linear-to-r from-white to-transparent" : "bg-linear-to-l from-white to-transparent"}`} />
            <button
              onClick={() => {
                const vp = wrapperRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
                vp?.scrollBy({ left: isAr ? -280 : 280, behavior: "smooth" });
              }}
              style={{ [isAr ? "left" : "right"]: "10px" }}
              className="absolute pointer-events-auto top-1/2 -translate-y-1/2
                w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md
                flex items-center justify-center text-slate-500
                hover:bg-neutral-900 hover:text-white hover:border-neutral-900
                transition-all duration-200 active:scale-90"
            >
              {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>
        )}

        <ScrollArea dir={isAr ? "rtl" : "ltr"} className="w-full">
          <div className="flex gap-3 px-1 pb-3 pt-1">
            {categories.map((cat: any, index: number) => {
              const label = isAr ? cat.name_ar : cat.name;
              return (
                <Link
                  key={index}
                  href={`/products/${cat.category_id}`}
                  className="group/card shrink-0 active:scale-[0.97] transition-transform duration-200"
                >
                  <div className="relative w-[250px] sm:w-[200px] md:w-[500px] aspect-5/3 overflow-hidden bg-slate-100">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={label || "category"}
                        fill
                        sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 240px"
                        className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-300 uppercase tracking-widest">
                        N/A
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors duration-500" />
                    <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5">
                      <p className={`text-white font-semibold truncate drop-shadow-sm
                        text-[11px] sm:text-[12px] md:text-[13px]
                        ${isAr ? "text-right" : "text-left uppercase tracking-wide"}`}>
                        {label}
                      </p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="h-0.5 opacity-0" />
        </ScrollArea>

      </div>
    </section>
  );
}