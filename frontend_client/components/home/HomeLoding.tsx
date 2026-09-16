import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-8 rounded-3xl p-4">
      {/* 1. Hero Section Skeleton */}
      <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* 2. Categories Skeleton (Circles) */}
      <div className="space-y-3">
         <Skeleton className="h-6 w-32" /> {/* Title */}
         <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
         </div>
      </div>

      {/* 3. Products Grid Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" /> {/* Title */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[200px] w-full rounded-lg" /> {/* Image */}
              <Skeleton className="h-4 w-3/4" /> {/* Product Name */}
              <Skeleton className="h-4 w-1/4" /> {/* Price */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}