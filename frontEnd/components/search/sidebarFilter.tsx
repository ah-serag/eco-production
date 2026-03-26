"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useGetFilterCategoryQuery } from "@/redux/features/home/homeclientslice";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Star, RotateCcw, SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function FilterSidebar() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  const categoryId = params?.categoryId as string;

  const { data, isLoading } = useGetFilterCategoryQuery(categoryId, {
    skip: !categoryId || categoryId === "undefined",
  });

  const subCategories = useMemo(() => {
    if (!data) return [];
    const dataSource = Array.isArray(data) ? data[0] : data;
    return dataSource?.items ?? [];
  }, [data]);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [selectedSubs, setSelectedSubs] = useState<number[]>([]);
  
  const [localPrice, setLocalPrice] = useState<[number, number]>([
    Number(searchParams.get("price_min")) || 0,
    Number(searchParams.get("price_max")) || 5000,
  ]);
  
  const [rating, setRating] = useState<number>(Number(searchParams.get("rating")) || 0);

  useEffect(() => {
    const rawSubs = searchParams.get("sub");
    if (rawSubs) {
      setSelectedSubs(rawSubs.split(",").map(Number).filter((n) => !isNaN(n)));
    } else {
      setSelectedSubs([]);
    }
  }, [searchParams]);

  const updateFilters = useCallback(() => {
    if (!categoryId || categoryId === "undefined") return;
    const queryParams = new URLSearchParams(searchParams.toString());
    
    if (selectedSubs.length > 0) queryParams.set("sub", selectedSubs.join(","));
    else queryParams.delete("sub");

    if (localPrice[0] > 0) queryParams.set("price_min", String(localPrice[0]));
    else queryParams.delete("price_min");

    if (localPrice[1] < 5000) queryParams.set("price_max", String(localPrice[1]));
    else queryParams.delete("price_max");

    if (rating) queryParams.set("rating", String(rating));
    else queryParams.delete("rating");
    
    router.push(`/products/${categoryId}?${queryParams.toString()}`, { scroll: false });
  }, [selectedSubs, localPrice, rating, categoryId, router, searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters();
    }, 500); 
    return () => clearTimeout(delayDebounceFn);
  }, [localPrice, selectedSubs, rating, updateFilters]);

  const toggleSub = (id: number) => {
    setSelectedSubs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const FilterContent = () => (
    <div className={cn("space-y-5", isAr ? "pr-0 text-right" : "pl-0 text-left")} dir={isAr ? "rtl" : "ltr"}>
      <div className="hidden md:flex w-full items-center justify-between py-3 px-3  text-neutral-800 mb-4">
        <div className="flex items-center gap-2">
            <SlidersHorizontal size={14}  />
            <h2 className="text-[14px] font-semibold tracking-tight">{isAr ? "تصفية النتائج" : "Filter Results"}</h2>
        </div>
        <button 
          onClick={() => setIsDesktopOpen(false)} 
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className=" px-0.5 sm:px-2 space-y-6">
          {subCategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[12px] font-bold text-neutral-800 border-b pb-2 uppercase tracking-wider">
                {isAr ? "الأقسام الفرعية" : "Sub Categories"}
              </h3>
              <div className="space-y-1.5">
                {subCategories.map((sub: any) => (
                  <div 
                    key={sub.id} 
                    onClick={() => toggleSub(sub.id)}
                    className={cn(
                        "flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200 rounded-md border",
                        selectedSubs.includes(sub.id) 
                        ? "bg-secondary/10 " 
                        : "bg-neutral-50/50 border-transparent hover:bg-neutral-100/50"
                    )}
                  >
                    <span className={cn("text-[13px] transition-colors select-none", 
                      selectedSubs.includes(sub.id) ? "text-secondary font-bold" : "text-neutral-600"
                    )}>
                      {isAr ? sub.name_ar : sub.name}
                    </span>
                    <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        selectedSubs.includes(sub.id) ? "bg-secondary border-secondary" : "bg-white border-neutral-300"
                    )}>
                        {selectedSubs.includes(sub.id) && <Check size={11} className="text-white" strokeWidth={3}  />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-[12px] font-bold text-neutral-800 border-b pb-2 uppercase tracking-wider">
              {isAr ? "نطاق السعر" : "Price Range"}
            </h3>
            <div className="px-1">
              <Slider
                value={localPrice}
                min={0}
                max={5000}
                step={10}
                onValueChange={(v) => setLocalPrice(v as [number, number])}
                className="[&_.relative]:bg-chart-1"
              />
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-neutral-50 border border-neutral-100 rounded-sm" dir="ltr">
              <span className="text-[12px] font-bold text-neutral-700">{localPrice[0]} <small className="font-normal opacity-50">EGP</small></span>
              <span className="text-[12px] font-bold text-neutral-700">{localPrice[1]} <small className="font-normal opacity-50">EGP</small></span>
            </div>
          </div>
           

           {/* rating  */}
          {/* <div className="space-y-5">
            <h3 className="text-[12px] font-bold text-neutral-800 border-b pb-2 uppercase tracking-wider">
              {isAr ? "التقييم" : "Rating"}
            </h3>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((r) => (
                <div 
                  key={r} 
                  onClick={() => setRating((prev) => (prev === r ? 0 : r))}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all rounded-md border",
                    rating === r ? "bg-secondary/10 border-secondary/20" : "bg-neutral-50/50 border-transparent hover:bg-neutral-100/50"
                  )}
                >
                  <div className="flex items-center gap-0.5" dir="ltr">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={cn(i < r ? "fill-yellow-400 text-yellow-400" : "fill-neutral-200 text-neutral-200")} />
                    ))}
                  </div>
                  <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        rating === r ? "bg-secondary border-secondary" : "bg-white border-neutral-300"
                    )}>
                        {rating === r && <Check size={10} className="text-white" strokeWidth={4} />}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <button
            onClick={() => { setSelectedSubs([]); setLocalPrice([0, 5000]); setRating(0); }}
            className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 hover:text-secondary transition-colors pt-2 px-1"
          >
            <RotateCcw size={12} /> {isAr ? "إعادة ضبط" : "Clear Filters"}
          </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block relative">
        {!isDesktopOpen && (
          <button
            onClick={() => setIsDesktopOpen(true)}
            className={cn(
              "fixed top-32 z-50 bg-chart-1 text-white p-2.5 transition-all hover:px-5 active:scale-95",
              isAr ? "right-0 rounded-l-2xl" : "left-0 rounded-r-2xl"
            )}
          >
            <SlidersHorizontal size={14} />
          </button>
        )}
        <aside className={cn(
          "sticky top-28 h-fit transition-all duration-500 bg-white border border-neutral-100 overflow-hidden",
          isDesktopOpen ? "w-64 opacity-100 visible" : "w-0 opacity-0 invisible pointer-events-none"
        )}>
          <div className="w-64">
            <FilterContent />
          </div>
        </aside>
      </div>

      <button 
        onClick={() => setIsMobileOpen(true)} 
        className="md:hidden fixed bottom-[30px] rounded-md right-6 z-40 bg-chart-1 text-white p-2.5 active:scale-90 transition-transform"
        style={{ marginBottom: '64px' }}
      >
        <SlidersHorizontal size={20} strokeWidth={2} />
      </button>

      <div className={cn("fixed inset-0 z-100 md:hidden transition-all duration-300", isMobileOpen ? "visible" : "invisible")}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsMobileOpen(false)} />
        <div className={cn(
          "absolute top-0 bottom-0 w-[80%] bg-white transition-transform duration-500 ease-out overflow-hidden",
          isAr ? "right-0 translate-x-0" : "left-0 translate-x-0",
          !isMobileOpen && (isAr ? "translate-x-full" : "-translate-x-full")
        )}>
          <div className="flex justify-between items-center py-4 px-6 bg-secondary text-white">
            <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                <span className="text-sm font-semibold uppercase tracking-widest">{isAr ? "الفلاتر" : "Filters"}</span>
            </div>
            <X size={20} className="text-white/80 cursor-pointer hover:text-white" onClick={() => setIsMobileOpen(false)} />
          </div>
          <div className="p-4">
            <FilterContent />
          </div>
        </div>
      </div>
    </>
  );
}