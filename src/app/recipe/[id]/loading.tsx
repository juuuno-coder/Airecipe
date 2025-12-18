import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* 1. Hero Section Skeleton */}
      <div className="relative w-full py-12 md:py-20 overflow-hidden border-b border-white/5 bg-[#0a0a0a]">
        <div className="container max-w-[1400px] px-4 relative z-10">
            <div className="mb-8">
                <Skeleton className="h-4 w-24 bg-slate-800" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-end">
                {/* Image Skeleton */}
                <div className="w-full md:w-[320px] shrink-0">
                    <Skeleton className="aspect-square rounded-2xl bg-slate-800" />
                </div>
                
                {/* Text Skeleton */}
                <div className="flex-1 space-y-6 w-full">
                     <div className="space-y-4">
                        <div className="flex gap-3">
                            <Skeleton className="h-6 w-20 rounded-full bg-slate-800" />
                            <Skeleton className="h-6 w-20 rounded-full bg-slate-800" />
                        </div>
                        <Skeleton className="h-12 w-3/4 bg-slate-800" />
                        <div className="space-y-2">
                             <Skeleton className="h-6 w-full bg-slate-800" />
                             <Skeleton className="h-6 w-2/3 bg-slate-800" />
                        </div>
                     </div>

                     <div className="flex items-center gap-4 pt-2">
                        <Skeleton className="h-12 w-48 rounded-full bg-slate-800" />
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Content Skeleton */}
      <div className="container max-w-[1400px] px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
                 <div className="space-y-6">
                    <Skeleton className="h-8 w-32 bg-slate-800" />
                    <Skeleton className="h-40 w-full rounded-3xl bg-slate-800" />
                 </div>
                 <div className="space-y-6">
                    <Skeleton className="h-8 w-40 bg-slate-800" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-20 rounded-2xl bg-slate-800" />
                        <Skeleton className="h-20 rounded-2xl bg-slate-800" />
                    </div>
                 </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
                 <Skeleton className="h-64 rounded-3xl bg-slate-800" />
                 <Skeleton className="h-40 rounded-3xl bg-slate-800" />
            </div>
        </div>
      </div>
    </div>
  );
}
