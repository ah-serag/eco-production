"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { ChevronDown, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCagegoryAndSubOptionClientQuery } from "../../redux/features/home/homeclientslice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "@/i18n/navigation";

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  categoryName: string;
  items: SubCategory[];
}

export function MegaMenuNavbar() {
  const { data: categories, isLoading, isError } = useGetCagegoryAndSubOptionClientQuery(undefined);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
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
      className="relative w-full bg-white border-b z-40 hidden md:block shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      onMouseLeave={closeMenu}
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
                    "px-4 flex items-center gap-1.5 text-[13px] font-medium transition-all h-full relative outline-none",
                    activeCategory === category.id 
                      ? "text-secondary" 
                      : "text-slate-600 hover:text-secondary"
                  )}
                >
                  {category.categoryName}
                  <ChevronDown 
                    className={cn(
                      "w-3 h-3 transition-transform duration-300 opacity-50", 
                      activeCategory === category.id && "rotate-180 opacity-100"
                    )} 
                  />
                  
                  <div 
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-px bg-secondary transition-transform duration-500 scale-x-0 origin-left",
                      activeCategory === category.id && "scale-x-100"
                    )} 
                  />
                </button>
              </li>
            ))}
          </ul>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      {/* المنيو المنسدلة */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-white border-b shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform origin-top",
          activeCategory 
            ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto" 
            : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
        )}
      >
        <div className="container mx-auto grid grid-cols-12 min-h-80">
          
          {/* الجزء اليسار: الأقسام الفرعية */}
          <div className="col-span-9 p-10">
            <ScrollArea className="h-[250px] pr-6">
              <div className="grid grid-cols-3 gap-x-10 gap-y-5">
                {currentCategoryData?.items.map((sub, index) => (
                  <Link
                    key={sub.id}
                    href={`/products/${activeCategory}?sub=${sub.id}`}
                    onClick={closeMenu}
                    className={cn(
                      "group relative py-1.5 outline-none flex items-center gap-2 w-fit transition-all duration-500",
                      activeCategory ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors shrink-0" />
                    <span className="text-[14px] text-slate-500 group-hover:text-secondary transition-colors duration-300 font-normal truncate">
                      {sub.name}
                    </span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-secondary/30 transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>

            {currentCategoryData?.items.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm italic">
                No items available.
              </div>
            )}
          </div>

          {/* الجزء اليمين: Featured (لم يتم تعديله) */}
          <div className="col-span-3 p-10 bg-slate-50/40 border-l border-slate-100/60">
            <div className="h-full flex flex-col justify-between animate-in fade-in slide-in-from-right-4 duration-700">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-neutral-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 border border-slate-100 shadow-sm">
                  <Zap size={10} className="fill-secondary" />
                  Featured
                </div>
                
                <h3 className="text-xl font-bold text-slate-700 leading-tight mb-2">
                  {currentCategoryData?.categoryName}
                </h3>
                <p className="text-[12px] text-slate-400 font-medium mb-4">Handpicked selection</p>
                
                <p className="text-[13px] text-slate-500/80 leading-relaxed line-clamp-4">
                  Explore our premium range of products in {currentCategoryData?.categoryName}. Every item is chosen to ensure quality and style.
                </p>
              </div>

              <Link 
                href={`/products/${activeCategory}`}
                onClick={closeMenu}
                className="group flex items-center  justify-start gap-3  bg-transparent text-secondary rounded-xl text-[12px] font-bold  transition-all duration-500 active:scale-95"
              >
                View Collection
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}