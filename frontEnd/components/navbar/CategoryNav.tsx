"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { ChevronDown, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCagegoryAndSubOptionClientQuery } from "../../redux/features/home/homeclientslice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface SubCategory {
  id: number;
  name: string;
  name_ar: string;
}

interface Category {
  id: number;
  categoryName: string;
  categoryName_ar: string;
  items: SubCategory[];
}

export function MegaMenuNavbar() {
  const { data: categories, isLoading, isError } = useGetCagegoryAndSubOptionClientQuery(undefined);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const locale = useLocale();
  const isAr = locale === "ar";
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentCategoryData = useMemo(() => {
    if (!categories) return null;
    return (categories as Category[]).find((c) => c.id === activeCategory) || null;
  }, [categories, activeCategory]);

  const handleMouseEnter = (id: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(id);
    }, 200);
  };

  const closeMenu = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(null);
  }, []);

  if (isLoading) return <div className="h-12 bg-white/50 animate-pulse border-b" />;
  if (isError || !categories) return null;

  return (
    <nav 
      className="relative w-full bg-gray-50 shadow-sm  z-40 hidden md:block "
      onMouseLeave={closeMenu}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <ul className="flex items-center justify-between gap-1 h-12">
            {(categories as Category[]).map((category) => (
              <li
                key={category.id}
                className="h-full flex shrink-0 items-center"
                onMouseEnter={() => handleMouseEnter(category.id)}
              >
                <button
                  className={cn(
                    "px-4 flex items-center gap-1.5 text-[13px] font-medium transition-all duration-100 h-full relative outline-none",
                    activeCategory === category.id 
                      ? "text-primary bg-slate-200" 
                      : "text-primary"
                  )}
                >
                  {isAr ? category.categoryName_ar : category.categoryName}
                  <ChevronDown 
                    className={cn(
                      "w-3 h-3 transition-transform duration-300 opacity-50", 
                      activeCategory === category.id && "rotate-180 opacity-100"
                    )} 
                  />
                
                </button>
              </li>
            ))}
          </ul>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      <div
        dir="ltr"
        className={cn(
          "absolute top-full left-0 w-full h-[300px] bg-white border-b shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform origin-top",
          activeCategory 
            ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto" 
            : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
        )}
      >
        <div className="container mx-auto grid grid-cols-12 min-h-80">
          
          <div   
           className={cn("col-span-9 p-10", isAr ? "pl-6" : "pr-6")}>
            <ScrollArea className="h-[250px]">
              <div            dir={isAr ? "rtl" : "ltr"}
               className="grid grid-cols-3 gap-x-10 gap-y-5">
                {currentCategoryData?.items.map((sub, index) => (
                  <Link
                    key={sub.id}
                    href={`/products/${activeCategory}?sub=${sub.id}`}
                    onClick={closeMenu}
                    className={cn(
                      "group relative py-1.5 outline-none flex items-center gap-2 w-fit transition-all duration-500",
                      activeCategory 
                        ? "opacity-100 translate-x-0" 
                        : cn("opacity-0", isAr ? "translate-x-4" : "-translate-x-4")
                    )}
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors shrink-0" />
                    <span className="text-[14px] text-slate-500 group-hover:text-secondary transition-colors duration-300 font-normal truncate">
                      {isAr ? sub.name_ar : sub.name}
                    </span>
                    <span className={cn(
                      "absolute -bottom-0.5 w-0 h-px bg-secondary/30 transition-all duration-300 group-hover:w-full",
                      isAr ? "right-0" : "left-0"
                    )} />
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>

            {currentCategoryData?.items.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm italic">
                {isAr ? "لا توجد عناصر متاحة" : "No items available."}
              </div>
            )}
          </div>

          <div 
            dir={isAr ? "rtl" : "ltr"}
            className={cn(
            "col-span-3 p-10 bg-slate-50/40 h-[300px]" ,
            isAr ? "border-r border-slate-100/60" : "border-l border-slate-100/60"
          )}>
            <div className={cn(
              "h-full flex flex-col justify-between animate-in fade-in duration-700",
              isAr ? "slide-in-from-left-4" : "slide-in-from-right-4"
            )}>
              <div>
          
                <h3 className="text-xl font-bold text-slate-600 leading-tight mb-2">
                  {isAr ? currentCategoryData?.categoryName_ar : currentCategoryData?.categoryName}
                </h3>
                <p className="text-[12px] text-slate-400 font-medium mb-4">
                  {isAr ? "مجموعة مختارة بعناية" : "Handpicked selection"}
                </p>
                
                <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-4">
                  {isAr 
                  ? `استكشف مجموعتنا المختارة بعناية في قسم ${currentCategoryData?.categoryName_ar} حيث نجمع لك أفضل المنتجات التي تجمع بين الجودة العالية والتصميم العصري. عند النقر هنا، ستنتقل إلى تشكيلة واسعة تم فحص كل قطعة فيها بدقة لضمان تلبية احتياجاتك اليومية بأناقة وكفاءة. استمتع بتجربة تسوق فريدة تلبي تطلعاتك وتضفي لمسة من التميز على اختيارك.`
                    : `Explore our premium range of products in ${currentCategoryData?.categoryName}. Every item is chosen to ensure quality and style.`
                  }
                </p>
              </div>

              <Link 
                href={`/products/${activeCategory}`}
                onClick={closeMenu}
                className="group flex items-center justify-start gap-3 bg-gray-100 p-3 text-slate-600  text-[15px] font-bold transition-all duration-500 active:scale-95"
              >
                {isAr ? "عرض المجموعة" : "View Collection"}
                <ArrowRight size={25} className={cn("transition-transform text-primary", isAr ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5")} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}