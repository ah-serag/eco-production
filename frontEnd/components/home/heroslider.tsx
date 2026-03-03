"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
    <section className="relative w-full aspect-[2/1] md:aspect-[2/1] overflow-hidden shadow-sm group/slider">
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

      {banners.map((banner: any, index: number) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all duration-[1500ms] ease-in-out",
            index === current ? "opacity-100 scale-100 z-20" : "opacity-0 scale-105 z-10"
          )}
          style={{
            backgroundImage: `url(${banner.image_url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          {/* السهم المعدل بحركة انسيابية (Smooth & Minimal) */}
       {banner.cta_link && (
         <div className={cn(
        "absolute left-4 bottom-4 sm:left-12 sm:bottom-12 z-40 transition-all duration-1000 delay-500",
         index === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
         )}>
       <a 
         href={banner.cta_link}
         className="smooth-pulse group/btn relative flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white transition-all duration-500 hover:bg-white hover:text-chart-1 shadow-2xl active:scale-90"
        >
        {/* الطبقة النبضية خلف السهم */}
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-50 pointer-events-none" />
        
        {/* أيقونة السهم - أصغر للهاتف */}
        <ArrowRight className="h-4 w-4 sm:h-7 sm:w-7 transition-transform duration-500 ease-out group-hover/btn:translate-x-1" />
        
        {/* النص الجانبي - أصغر وأكثر تباعداً للأحرف */}
        <span className="absolute left-full ml-3 whitespace-nowrap opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.5em] text-white pointer-events-none drop-shadow-md">
          explore
        </span>
      </a>
    </div>
        )}
        </div>
      ))}

      {/* أزرار التحكم - تظهر وتختفي بنعومة */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/5 hover:bg-white hover:text-black backdrop-blur-md text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-700">
        <ChevronLeft size={20} />
      </button>

      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/5 hover:bg-white hover:text-black backdrop-blur-md text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-700">
        <ChevronRight size={20} />
      </button>

      {/* المؤشرات النحيفة */}
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
    </section>
  );
}