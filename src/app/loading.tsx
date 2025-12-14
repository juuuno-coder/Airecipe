import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen container px-4 py-8 space-y-12 animate-pulse">
        
      {/* 1. Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
         <Skeleton className="h-8 w-32 bg-slate-800 rounded-md" />
         <div className="flex gap-4">
            <Skeleton className="h-8 w-20 bg-slate-800 rounded-full" />
            <Skeleton className="h-8 w-8 bg-slate-800 rounded-full" />
         </div>
      </div>

      {/* 2. Challenge Banner Skeleton */}
      <div className="w-full h-64 md:h-80 bg-slate-800/50 rounded-3xl border border-white/5" />

      {/* 3. Featured Grid Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-slate-800 rounded-md mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-[300px] md:col-span-2 bg-slate-800/50 rounded-xl" />
            <Skeleton className="h-[300px] bg-slate-800/50 rounded-xl" />
            <Skeleton className="h-[300px] bg-slate-800/50 rounded-xl" />
            <Skeleton className="h-[300px] md:col-span-2 bg-slate-800/50 rounded-xl" />
        </div>
      </div>

       {/* 4. List Skeleton */}
       <div className="space-y-4">
        <Skeleton className="h-8 w-32 bg-slate-800 rounded-md mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full bg-slate-800/50 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-slate-800" />
                        <Skeleton className="h-4 w-1/2 bg-slate-800" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
