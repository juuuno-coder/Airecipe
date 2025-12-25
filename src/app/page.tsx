import { Zap, Layers, Code2, ImageIcon, Video, PenTool, Briefcase, Filter, Trophy } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { FeaturedRecipes } from "@/components/home/featured-recipes";
import { WeeklyBestRecipes } from "@/components/home/weekly-best";
import { AllRecipesGrid } from "@/components/home/recipe-grid";
import { WeeklyRanking } from "@/components/weekly-ranking";

export const revalidate = 3600; // 1시간 동안 서버 연산 없이 즉시 응답

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
    <div className="flex flex-col min-h-screen bg-[#020617]">
      
      {/* 1. Ultra-Minimal Hero (LCP Optimized) */}
      <section className="relative px-4 pt-20 pb-16 text-center border-b border-white/[0.03] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.08),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400">
                <Zap className="w-3 h-3 text-indigo-500" />
                <span>AI PROMPT RECIPES</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                오직 <span className="text-indigo-500">맛(Prompt)</span>으로 승부한다
            </h1>
            
            <p className="max-w-xl mx-auto text-slate-400 text-lg leading-relaxed font-medium">
                계급장 떼고 붙는 AI 요리 대회.<br/>
                당신의 상상력을 최고의 레시피로 만드세요.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link href="/create">
                    <button className="h-12 px-8 rounded-xl bg-white text-black font-black hover:bg-slate-200 transition-all active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.1)]">
                        레시피 등록하기
                    </button>
                </Link>
                <Link href="/rankings">
                    <button className="h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95">
                        명예의 전당
                    </button>
                </Link>
            </div>
        </div>
      </section>

      {/* 2. Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 space-y-16 py-12">
        
        {/* 주간 랭킹 - Simple style */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">실시간 주간 랭킹</h2>
          </div>
          <Suspense fallback={<div className="h-32 bg-white/5 rounded-2xl animate-pulse" />}>
            <WeeklyRanking />
          </Suspense>
        </section>

        {/* Featured Section */}
        <Suspense fallback={<div className="h-64 bg-white/5 rounded-2xl animate-pulse" />}>
          <FeaturedRecipes category={currentCategory} />
        </Suspense>

        {/* Categories & Full Grid */}
        <section className="space-y-8">
            <div className="sticky top-14 z-40 py-4 bg-[#020617]/95 backdrop-blur-sm border-b border-white/[0.03]">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <span className="text-xs font-bold text-slate-500 mr-2 shrink-0 uppercase tracking-widest"><Filter className="w-3 h-3 inline mr-1" /> Filter</span>
                    {categories.map((cat, i) => {
                        const isActive = currentCategory === cat.name;
                        return (
                            <Link key={i} href={cat.name === "전체" ? "/" : `/?category=${cat.name}`} scroll={false} className="shrink-0">
                                <button className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                                    ${isActive 
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            </Link>
                    )})}
                </div>
            </div>

            <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="aspect-[4/3] bg-white/5 rounded-xl animate-pulse" /></div>}>
                <AllRecipesGrid category={currentCategory} />
            </Suspense>
        </section>

      </div>
    </div>
  );
}
