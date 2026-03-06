"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronRight, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCagegoryAndSubOptionClientQuery } from "../../redux/features/home/homeclientslice";
import { Button } from "../ui/button";

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: categories } = useGetCagegoryAndSubOptionClientQuery(undefined);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 z-60 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      <aside 
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-white z-70 shadow-2xl transition-transform duration-300 ease-out transform md:hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-slate-800">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Categories
          </div>
          
          {categories?.map((category: any) => (
            <div key={category.id} className="border-b border-slate-50 last:border-0">
              <button
                onClick={() => setExpandedCat(expandedCat === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-4 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className={cn("text-sm font-medium", expandedCat === category.id && "text-chart-1")}>
                  {category.categoryName}
                </span>
                <ChevronDown size={16} className={cn("transition-transform duration-300", expandedCat === category.id && "rotate-180")} />
              </button>

              <div className={cn(
                "overflow-hidden transition-all duration-300 bg-slate-50/50",
                expandedCat === category.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="flex flex-col py-2">
                  <Link 
                    href={`/products/${category.id}`}
                    onClick={onClose}
                    className="flex items-center gap-2 px-6 py-2.5 text-[13px] text-chart-1 font-bold"
                  >
                    View All Collection <ChevronRight size={14} />
                  </Link>
                  {category.items.map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={`/products/${sub.id}`}
                      onClick={onClose}
                      className="px-6 py-2.5 text-[13px] text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>


      </aside>
    </>
  );
}