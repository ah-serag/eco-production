import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 rounded-xl  bg-white p-3 ">
      <Skeleton className="h-[180px] w-full rounded-lg bg-slate-200" />
      
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-3/4 bg-slate-200" />
        <Skeleton className="h-4 w-1/2 bg-slate-200" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-20 bg-slate-200" />
        <Skeleton className="h-8 w-8 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}