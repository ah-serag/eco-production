"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function SkeletonProductPreview() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE — IMAGES SKELETON */}
        <div className="col-span-2 sm:flex-row flex-col flex gap-4">
          {/* Thumbnails Skeleton */}
          <div className="flex flex-col sm:order-1 order-2 gap-3 w-20 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg w-full" />
            ))}
          </div>

          {/* Main Image Skeleton */}
          <div className="sm:order-2 w-full h-[400px] md:h-[520px]">
             <Skeleton className="w-full h-full rounded-2xl" />
          </div>
        </div>

        {/* RIGHT SIDE — INFO SKELETON */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-4">
            {/* Category Badge */}
            <Skeleton className="h-5 w-20 rounded-full" />
            
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>

            {/* SKU */}
            <Skeleton className="h-3 w-32" />
          </div>

          <Separator className="bg-slate-100" />

          {/* Price Section */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>

          <Separator className="bg-slate-100" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Quantity & Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            <div className="flex flex-row gap-3">
              <Skeleton className="flex-1 h-12 rounded-xl" />
              <Skeleton className="flex-[1.8] h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}