"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useGetFilterCategoryQuery } from "@/redux/features/home/homeclientslice";
import { useEffect, useState, useCallback } from "react";
import { Star, RotateCcw, SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilterSidebar() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = params?.categoryId as string;

  const { data, isLoading } = useGetFilterCategoryQuery(categoryId, {
    skip: !categoryId || categoryId === "undefined",
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);

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
    const queryParams = new URLSearchParams();
    if (selectedSubs.length > 0) queryParams.set("sub", selectedSubs.join(","));
    if (localPrice[0] > 0) queryParams.set("price_min", String(localPrice[0]));
    if (localPrice[1] < 5000) queryParams.set("price_max", String(localPrice[1]));
    if (rating) queryParams.set("rating", String(rating));
    
    router.push(`/products/${categoryId}?${queryParams.toString()}`, { scroll: false });
  }, [selectedSubs, localPrice, rating, categoryId, router]);

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
    <div className="space-y-5">
      <div className="hidden md:flex w-full items-center justify-between py-4 bg-gray-50">
        <h2 className="text-[15px] font-semibold text-neutral-800">Filters</h2>
        <button 
          onClick={() => setIsDesktopOpen(false)} 
          className="p-1.5 rounded-md text-chart-1 hover:bg-chart-1/5 transition-all"
        >
          <SlidersHorizontal size={13} />
        </button>
      </div>

      <div className="space-y-5">
        <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Category</h3>
        <div className="space-y-4">
          {data?.[0]?.items?.map((sub: any) => (
            <label key={sub.id} className="flex items-center gap-3.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <Checkbox
                  checked={selectedSubs.includes(sub.id)}
                  onCheckedChange={() => toggleSub(sub.id)}
                  className="w-4 h-4 rounded-full border-neutral-300 data-[state=checked]:bg-chart-1 data-[state=checked]:border-chart-1 transition-all"
                />
                <Check className={cn(
                  "absolute text-white transition-all duration-200 scale-0 opacity-0 pointer-events-none",
                  selectedSubs.includes(sub.id) && "scale-50 opacity-100"
                )} size={5} strokeWidth={4} />
              </div>
              <span className={cn("text-[13px] transition-colors", 
                selectedSubs.includes(sub.id) ? "text-chart-1 font-bold" : "text-neutral-600"
              )}>
                {sub.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Price Range</h3>
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
        <div className="flex justify-between items-center py-2 px-3 bg-neutral-50 rounded-lg border border-neutral-100">
          <span className="text-[12px] font-bold text-neutral-700">{localPrice[0]} <small className="font-normal opacity-50">EGP</small></span>
          <span className="text-[12px] font-bold text-neutral-700">{localPrice[1]} <small className="font-normal opacity-50">EGP</small></span>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Rating</h3>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-3.5 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <Checkbox
                  checked={rating === r}
                  onCheckedChange={() => setRating((prev) => (prev === r ? 0 : r))}
                  className="w-4 h-4 rounded-full border-neutral-300 data-[state=checked]:bg-chart-1 data-[state=checked]:border-chart-1 transition-all"
                />
                <Check className={cn(
                  "absolute text-white transition-all duration-200 scale-0 opacity-0 pointer-events-none",
                  rating === r && "scale-100 opacity-100"
                )} size={10} strokeWidth={4} />
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className={cn(i < r ? "fill-yellow-400 text-yellow-400" : "fill-neutral-100 text-neutral-100")} />
                ))}
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setSelectedSubs([]); setLocalPrice([0, 5000]); setRating(0); }}
        className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 hover:text-chart-1 transition-colors pt-2"
      >
        <RotateCcw size={12} /> Clear Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block relative">
        {!isDesktopOpen && (
          <button
            onClick={() => setIsDesktopOpen(true)}
            className="fixed left-0 top-32 z-50 bg-chart-1 text-white p-2.5 rounded-r-lg shadow-xl shadow-chart-1/20 transition-all hover:pl-4 active:scale-95"
          >
            <SlidersHorizontal size={14} />
          </button>
        )}
        <aside className={cn(
          "sticky top-28 h-fit transition-all duration-500",
          isDesktopOpen ? "w-52 opacity-100 visible" : "w-0 opacity-0 invisible pointer-events-none"
        )}>
          <div className="w-52 pr-6 border-r border-neutral-100/80">
            <FilterContent />
          </div>
        </aside>
      </div>

      {/* Mobile Floating Button - 64px Above Bottom Nav */}
      <button 
        onClick={() => setIsMobileOpen(true)} 
        className="md:hidden fixed bottom-[30px] right-6 z-40 bg-chart-1 text-white p-2.5 rounded-xl shadow-lg shadow-chart-1/20 active:scale-90 transition-transform"
        style={{ marginBottom: '64px' }} // المسافة المطلوبة فوق الـ Nav
      >
        <SlidersHorizontal size={20} strokeWidth={2} />
      </button>

      {/* Mobile Drawer */}
      <div className={cn("fixed inset-0 z-100 md:hidden transition-all duration-300", isMobileOpen ? "visible" : "invisible")}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsMobileOpen(false)} />
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-[80%] bg-white p-8 shadow-2xl transition-transform duration-500 ease-out",
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">Filters</span>
            <X size={20} className="text-neutral-400 cursor-pointer" onClick={() => setIsMobileOpen(false)} />
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );
}