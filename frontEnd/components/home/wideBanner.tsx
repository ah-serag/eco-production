"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface BannerItem {
  url_image: string;
  link: string;
}

interface WideBannerProps {
  section: {
    info: {
      wideBinner_items: BannerItem[]; 
    };
  };
}

export default function WideBannerRender({ section }: WideBannerProps) {
  const [current, setCurrent] = useState(0);
  const banners = section.info.wideBinner_items ?? [];
  const length = banners.length;
  const locale = useLocale();
  
  const isAr = locale == "ar" ;

  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [length]);

  if (!banners || length === 0) return null;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  return (
    <section className=" w-full group/wide">
      <div className="relative w-full aspect-3/1 p-1 overflow-hidden border-slate-100 bg-slate-50">
        
        {banners.map((item, index) => (
          <Link 
            key={index} 
            href={item?.link || "#"}
            className={cn(
              "absolute inset-0 transition-transform duration-2000 ease-out",
              index === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
            )}
          >
            <Image
              src={`${item?.url_image}`}
              alt={`Banner ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover  hover:scale-105 transition-transform duration-700"
              sizes="(max-w-1400px) 100vw, 1400px"
            />


            
                    <div
                        className="absolute bottom-0 inset-x-0 px-4 pb-4 md:pb-5 flex flex-col gap-2"
                        dir={isAr ? "rtl" : "ltr"}
                      >
           
                {item?.link && (
  <span
    className="group/btn self-start mt-1 inline-flex items-center gap-2
      text-[9px] md:text-[13px] uppercase tracking-[0.2em] font-semibold
      bg-white/10 hover:bg-white text-white hover:text-slate-900
      backdrop-blur-sm border border-white/30 hover:border-white
      px-3 py-1.5
      transition-all duration-300"
  >
    {isAr ? "تسوق الآن" : "Shop Now"}
    <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
      {isAr ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
    </span>
  </span>
)}


                      </div>
          </Link>



        ))}
          

                  











        {/* أزرار التحكم - تظهر فقط لو وجد أكثر من صورة */}
        {length > 1 && (
          <>
            <button 
              onClick={prevSlide} 
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/10 hover:bg-white hover:text-black backdrop-blur-md text-white opacity-0 group-hover/wide:opacity-100 transition-all duration-500 shadow-lg"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/10 hover:bg-white hover:text-black backdrop-blur-md text-white opacity-0 group-hover/wide:opacity-100 transition-all duration-500 shadow-lg"
            >
              <ChevronRight size={18} />
            </button>

            {/* المؤشرات النحيفة */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrent(index);
                  }}
                  className={cn(
                    "h-1 transition-all duration-500 rounded-full",
                    index === current ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}