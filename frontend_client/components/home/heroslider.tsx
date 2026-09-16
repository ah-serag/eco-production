"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function HeroSlider({ section }: any) {
  const [current, setCurrent] = useState(0);
  const banners = section ?? [];
  const length = banners.length;

  useEffect(() => {
    if (!length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [length]);

  if (!Array.isArray(banners) || length === 0) return null;

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));

  return (
    <section className="relative w-full   px-4 aspect-4/5   md:aspect-2/1  overflow-hidden shadow-sm group/slider">
      <style jsx>{`
        @keyframes soft-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .smooth-pulse {
          animation: soft-pulse 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
      `}</style>

      {banners.map((banner: any, index: number) => {
        const desktopUrl = banner.desktop_image_url;
        const mobileUrl  = banner.mobile_image_url || desktopUrl;

        return (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all duration-1500 ease-in-out",
            index === current ? "opacity-100 scale-100 z-20" : "opacity-0 scale-105 z-10"
          )}
        >
          {/* صورة الموبايل */}
          <div
            className="absolute inset-0 block sm:hidden"
            style={{
              backgroundImage: `url(${mobileUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* صورة الكمبيوتر */}
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              backgroundImage: `url(${desktopUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />

          {banner.cta_link ? (
            <Link href={banner.cta_link} className="absolute inset-0 block z-10">
              <div className="absolute inset-0 bg-black/10" />
            </Link>
          ) : ( 
            <div className="absolute inset-0 bg-black/10 z-10" />
          )}

          {banner.cta_link && banner.cta_text && (
            <div className={cn(
              "absolute left-3 bottom-10 sm:left-14 sm:bottom-14 z-40 transition-all duration-700 delay-300",
              index === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}>
              <Link
                href={banner.cta_link}
                className="group/btn relative inline-flex items-center gap-3 px-5 py-3 sm:px-7 sm:py-4 rounded-full bg-white/10 hover:bg-white backdrop-blur-xl border border-white/30 hover:border-white text-white hover:text-slate-900 transition-all duration-500 shadow-2xl active:scale-95"
              >
                <span className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-30 pointer-events-none" />
                <span className="relative text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.2em]">
                  {banner.cta_text}
                </span>
                <span className="relative w-px h-3 bg-white/40 group-hover/btn:bg-slate-400 transition-colors" />
                <ArrowRight className="relative h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
        );
      })}

      {length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-3 rounded-full bg-white/10 hover:bg-white hover:text-black backdrop-blur-md text-white opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 transition-all duration-700 active:scale-90">
            <ChevronLeft className="w-3 h-3 sm:w-5 sm:h-5" />
          </button>

          <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1 sm:p-3 rounded-full bg-white/10 hover:bg-white hover:text-black backdrop-blur-md text-white opacity-100 sm:opacity-0 sm:group-hover/slider:opacity-100 transition-all duration-700 active:scale-90">
            <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {length > 1 && (
        <div className="absolute bottom-6 right-8 z-30 flex gap-2">
          {banners.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={cn(
                "h-0.5 transition-all duration-700 rounded-full",
                index === current ? "w-10 bg-white" : "w-2 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}