"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function CategorySection({ section }: any) {
  const category = section?.content ?? [];
  const info = section?.info;

  return (
    <section className="bg-white  p-2 rounded-3xl shadow-sm overflow-hidden my-6">
      
      {/* ===== Minimal Header - بسيط ومريح للعين ===== */}
      {info?.title && (
        <div className="py-6 px-6 flex items-baseline gap-3 bg-white">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight">
            {info.title}
          </h2>
          
          {info.subtitle && (
            <div className="flex items-center gap-3 text-gray-400 border-l border-gray-200 pl-3">
              <span className="text-xs md:text-sm font-normal uppercase tracking-[0.2em]">
                {info.subtitle}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ===== Categories Carousel - بدون خلفيات مزعجة ===== */}
      <ScrollArea className="w-full">
        <div className="flex gap-8 md:gap-14 px-8 pb-10 w-max mx-auto">
          {category
            .filter((cat: any) => cat?.category_id && (cat?.image_url || cat?.title))
            .map((cat: any, index: number) => (
              <Link
                key={index}
                href={`/searchpro/${cat.category_id}`}
                className="group block"
              >
                <div className="flex flex-col items-center gap-4">
                  {/* Category Image - دائرة شفافة تماماً */}
                  <div className="relative w-20 h-20 md:w-28 md:h-28  flex items-center justify-center transition-all duration-500">
                    {cat?.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.title || "Category"}
                        fill
                        sizes="(max-width: 768px) 80px, 112px"
                        className="object-contain transition-opacity rounded-full duration-300 group-hover:opacity-80" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Title - التأثير هنا فقط عند الـ Hover */}
                  <div className="relative pt-1">
                    <span className="text-[13px] md:text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-black tracking-tight">
                      {cat.title || "Untitled"}
                    </span>
                    {/* خط سفلي نحيف جداً يظهر بنعومة */}
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-1px bg-black transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </section>
  );
}