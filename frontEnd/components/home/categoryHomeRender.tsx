"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function CategorySection({ section }: any) {
  const category = section?.content || null ;
  const info = section?.info;
   
 if (!category || section.content.length === 0) {
  return null; 
} 


  useEffect(() => {
    const timer = setTimeout(() => {
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ left: 50, behavior: 'smooth' });
        setTimeout(() => {
          viewport.scrollTo({ left: 0, behavior: 'smooth' });
        }, 500);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-transparent border-b border-gray-100   overflow-hidden my-1 group/section">
      
      {/* ===== Header أنيق وصغير ===== */}
      {info?.title && (
        <div className="pt-6 px-4 flex flex-col gap-0.5">
          <h2 className="text-[14px] md:text-[23px] font-semibold   tracking-tight leading-none">
            {info.title}
          </h2>
          
          {info.subtitle && (
            <span className="text-[8px] md:text-[9px] font-medium uppercase tracking-[0.3em] mt-1">
              {info.subtitle}
            </span>
          )}
        </div>
      )}

      {/* ===== Categories Carousel ===== */}
      <ScrollArea className="w-full">
        <div className="flex gap-6 md:gap-12 px-8 py-8 w-max mx-auto items-center justify-center">
          {category
            .filter((cat: any) => cat?.category_id && (cat?.image_url || cat?.title))
            .map((cat: any, index: number) => (
              <Link
                key={index}
                href={`/products/${cat.category_id}`}
                className="group flex flex-col items-center gap-2.5 transition-all duration-300 active:scale-90"
              >
                <div className="relative w-20 h-20  md:w-30 md:h-30 flex items-center justify-center bg-transparent rounded-full transition-all duration-500 group-hover:scale-110">
                  {cat?.image_url ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={cat.image_url}
                        alt={cat.title || "Category"}
                         fill
                        className="object-contain p-1 drop-shadow-sm rounded-full  transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center text-[8px] text-gray-300 uppercase tracking-widest">
                      N/A
                    </div>
                  )}
                </div>

                {/* Title - خط صغير وناعم جداً */}
                <div className="text-center">
                  <span className="text-[10px] md:text-[11px] font-semibold text-gray-500 transition-colors duration-300 group-hover:text-black tracking-tight">
                    {cat.title || "Untitled"}
                  </span>
                </div>
              </Link>
            ))}
        </div>

        {/* السكرول بار يظهر فقط عند الـ Hover */}
        <ScrollBar 
          orientation="horizontal" 
          className="h-1 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300" 
        />
      </ScrollArea>
    </section>
  );
}