"use client";

import React from "react";

export default function SkeletonClientOrders() {
  const skeletonCards = Array.from({ length: 3 });

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex justify-between items-baseline border-b border-slate-100 pb-6">
        <div className="space-y-3">
          <div className="h-7 w-48 bg-slate-200 rounded-md" /> {/* Title */}
          <div className="h-3 w-64 bg-slate-100 rounded-md" /> {/* Subtitle */}
        </div>
        <div className="h-4 w-24 bg-slate-100 rounded-full" /> {/* Total Count */}
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-6">
        {skeletonCards.map((_, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-50 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Card Header Skeleton */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <div className="h-2 w-10 bg-slate-200 rounded" />
                  <div className="h-3 w-16 bg-slate-300 rounded" />
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-2 w-16 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-300 rounded" />
                </div>
              </div>
              <div className="h-5 w-20 bg-slate-200 rounded-full" /> {/* Status Badge */}
            </div>

            {/* Card Body Skeleton */}
            <div className="px-6 py-6">
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1 space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-[60%] bg-slate-200 rounded" />
                      <div className="h-2 w-[30%] bg-slate-100 rounded" />
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-[50%] bg-slate-200 rounded" />
                      <div className="h-2 w-[25%] bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>

                {/* Price & Action Skeleton */}
                <div className="flex flex-col items-end gap-4 shrink-0">
                  <div className="space-y-2 flex flex-col items-end">
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                  </div>
                  <div className="h-8 w-24 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}