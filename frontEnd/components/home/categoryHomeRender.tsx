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

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtEnd,   setIsAtEnd]   = useState(false);

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
  }, [categories]);

  if (categories.length === 0) return null;

  const sectionTitle    = isAr ? info?.title_ar    : info?.title;
  const sectionSubtitle = isAr ? info?.subtitle_ar : info?.subtitle;

  return (
    <section className="my-4" dir={isAr ? "rtl" : "ltr"}>

      {sectionTitle && (
        <div className={`relative mb-4  flex py-4 bg-slate-50 p-2 border  border-neutral-100 items-center justify-between gap-3 ${isAr ? "flex-row-reverse" : ""}`}>

          <div className={`flex flex-col gap-1 ${isAr ? "items-end" : "items-start"}`}>
            <h2 className={`font-semibold text-slate-900 leading-none ${
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

          <div className={`hidden md:flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : ""}`}>
            {[1,2,3].map(i => (
              <span key={i} className="w-1 h-1 rounded-full bg-slate-200" style={{ opacity: 1 - i * 0.25 }} />
            ))}
          </div>

        </div>
      )}

      <div ref={wrapperRef} className="relative">

        {/* Wavy rope */}
        <div className="absolute inset-x-0 top-[73px] md:top-[100px] -translate-y-1/2 z-0 pointer-events-none px-4">
          <svg viewBox="0 0 400 14" preserveAspectRatio="none" className="w-full h-3.5" fill="none">
            <path
              d="M0 7 C15 1,30 13,45 7 S75 1,90 7 S120 13,135 7 S165 1,180 7 S210 13,225 7 S255 1,270 7 S300 13,315 7 S345 1,360 7 S385 13,400 7"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Arrow — exact same as ProductsHomeCarouselPro */}
        {canScroll && !isAtEnd && (
          <div className={`absolute top-0 bottom-0 z-20 pointer-events-none
            ${isAr ? "left-0" : "right-0"}`}>
            <div className={`absolute inset-y-0 w-20
              ${isAr ? "bg-linear-to-r from-white to-transparent left-0" : "bg-linear-to-l from-white to-transparent right-0"}`} />
            <button
              onClick={() => {
                const vp = wrapperRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
                vp?.scrollBy({ left: isAr ? -280 : 280, behavior: "smooth" });
              }}
              style={{ [isAr ? "left" : "right"]: "10px" }}
              className="absolute pointer-events-auto top-[73px] md:top-[100px] -translate-y-1/2
                w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md
                flex items-center justify-center text-slate-500
                hover:bg-neutral-900  hover:text-white hover:border-neutral-900
                transition-all duration-200 active:scale-90"
            >
              {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>
        )}

        <ScrollArea dir={isAr ? "rtl" : "ltr"} className="w-full relative z-0">
          <div className="flex gap-5 justify-evenly px-4 pb-3 pt-1">
            {categories.map((cat: any, index: number) => {
              const label = isAr ? cat.name_ar : cat.name;
              return (
                <Link
                  key={index}
                  href={`/products/${cat.category_id}`}
                  className="group/card shrink-0 active:scale-[0.97] transition-transform duration-200"
                >
                  <div className="relative w-[110px] md:w-[150px] aspect-3/4 overflow-hidden  bg-white ring-1 ring-slate-100 shadow-sm">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={label || "category"}
                        fill
                        sizes="150px"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-300 uppercase tracking-widest">
                        N/A
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pt-6 pb-2.5 px-2">
                      <p className="text-center text-[10px] md:text-[11px] font-semibold text-white uppercase tracking-wide truncate drop-shadow">
                        {label}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="h-1 opacity-0" />
        </ScrollArea>

      </div>

    </section>
  );
}
