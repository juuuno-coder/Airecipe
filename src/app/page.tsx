import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Cpu, Command, Terminal, Layers, Sparkles, TrendingUp, Filter, Code2, PenTool, Image as ImageIcon, Briefcase, Clock, Video, Trophy } from "lucide-react";
import Link from "next/link";
import { MainBanner } from "@/components/main-banner";
import { WeeklyRanking } from "@/components/weekly-ranking";

// Async Components (Streaming)
import { Suspense } from "react";
import { FeaturedRecipes } from "@/components/home/featured-recipes";
import { WeeklyBestRecipes } from "@/components/home/weekly-best";
import { AllRecipesGrid } from "@/components/home/recipe-grid";

// Cache data (ISR)
export const revalidate = 60;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const currentCategory = params.category || "전체";

  const categories = [
    { name: "전체", icon: Layers },
    { name: "개발", icon: Code2 },
    { name: "디자인", icon: ImageIcon },
    { name: "이미지", icon: ImageIcon },
    { name: "영상", icon: Video },
    { name: "글쓰기", icon: PenTool },
    { name: "생산성", icon: Briefcase },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200">
      
      {/* 1. Hero Section (Static - Loads Instantly) */}
      <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-[#0a0a0a] pb-32">
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-[#020617]/50 to-[#020617] z-10" />
        </div>

        <div className="container px-4 z-20 text-center space-y-8 animate-in fade-in zoom-in duration-1000 mt-10">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-slate-300 mb-4 backdrop-blur-md shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
                <span className="font-semibold tracking-wide">AI Culinary Class Wars</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white pb-2 drop-shadow-2xl">
                <span className="block text-slate-500 text-2xl md:text-4xl font-bold tracking-tight mb-2">계급장 떼고 붙자</span>
                오직 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">맛(Prompt)</span>으로 승부한다
            </h1>
            
            <p className="max-w-[600px] mx-auto text-slate-400 md:text-xl/relaxed font-light leading-relaxed">
                당신의 상상력이 유일한 무기입니다.<br/>
                최고의 AI 레시피로 명예의 전당에 도전하세요.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                <Link href="/create">
                    <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black hover:bg-slate-200 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105">
                         새로운 레시피 등록
                    </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full border-white/20 bg-black/50 text-white hover:bg-white/10 hover:text-white backdrop-blur-md font-medium text-lg">
                     명예의 전당 보기
                </Button>
            </div>
        </div>
      </section>

      {/* 2. Main Banner (Admin Managed) */}
      <Suspense fallback={<div className="container h-64 bg-white/5 animate-pulse rounded-xl my-8" />}>
         <MainBanner />
      </Suspense>

      {/* 3. Weekly Ranking Section */}
      <section className="container px-4 py-8">
         <div className="flex items-center gap-2 mb-6">
            <div className="bg-yellow-500/10 p-2 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">🏆 실시간 주간 랭킹</h2>
         </div>
         {/* Suspense for Ranking */}
         <Suspense fallback={<div className="h-40 bg-white/5 rounded-xl animate-pulse" />}>
            <WeeklyRanking />
         </Suspense>
      </section>

      {/* 4. Featured Recipes (Streaming) */}
      <Suspense fallback={<div className="container h-[400px] bg-white/5 animate-pulse rounded-xl my-12" />}>
         <FeaturedRecipes category={currentCategory} />
      </Suspense>

      {/* 5. Weekly Best (Streaming) */}
      <Suspense fallback={<div className="container h-[300px] bg-white/5 animate-pulse rounded-xl my-8" />}>
         <WeeklyBestRecipes category={currentCategory} />
      </Suspense>

      {/* 6. Filter & All Recipes Grid (Streaming) */}
      <section className="container px-4 py-8 space-y-4">
        {/* Category Filter - Needs to be interactive immediately? It's static links mostly. */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium mr-2 text-slate-400 flex items-center shrink-0"><Filter className="h-3 w-3 mr-1" /> Category:</span>
            {categories.map((cat, i) => {
              const isActive = currentCategory === cat.name;
              return (
              <Link key={i} href={cat.name === "전체" ? "/" : `/?category=${cat.name}`} scroll={false}>
                <Button 
                    variant={isActive ? "default" : "outline"} 
                    size="sm" 
                    className={`h-8 rounded-md px-3 border-white/5 transition-all ${isActive ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900/50 text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-500/20'}`}
                >
                    <cat.icon className="mr-2 h-3 w-3" /> {cat.name}
                </Button>
              </Link>
            )})}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="container grid grid-cols-1 md:grid-cols-4 gap-6 h-[800px]"><div className="bg-white/5 animate-pulse rounded-xl col-span-4 h-full" /></div>}>
         <AllRecipesGrid category={currentCategory} />
      </Suspense>

    </div>
  );
}
