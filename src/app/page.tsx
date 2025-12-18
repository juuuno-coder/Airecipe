import { Button } from "@/components/ui/button";
import { BentoGrid, BentoGridItem } from "@/components/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Cpu, Command, Terminal, Layers, Sparkles, TrendingUp, Filter, Code2, PenTool, Image as ImageIcon, Briefcase, Clock, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecipeCard } from "@/components/recipe-card";
import { MainBanner } from "@/components/main-banner";
import { WeeklyRanking } from "@/components/weekly-ranking";
import { Trophy } from "lucide-react";

// Cache data for 60 seconds (ISR) to improve performance
export const revalidate = 60;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createClient();


  // Parallel Fetching for Performance
  const [params] = await Promise.all([
    searchParams,
  ]);
  
  const currentCategory = params.category || "전체";
  
  // Optimize: Select only necessary columns
  let query = supabase
    .from("recipes")
    .select(`
        id, 
        title, 
        description, 
        image_url, 
        cooking_time_minutes, 
        created_at, 
        view_count, 
        user_id, 
        category,
        difficulty,
        profiles (username, avatar_url),
        likes (count)
    `)
    .order("created_at", { ascending: false })
    .limit(50); // Limit to 50 items for performance

  if (currentCategory !== "전체") {
      query = query.eq("category", currentCategory);
  }

  // Fetch recipes (No fallback needed as DB is stable)
  const { data: recipesData, error } = await query;
  
  const recipes = recipesData || [];

  if (error) {
    console.error("Home fetch error:", error);
  }

  // Separate data for sections
  const featuredRecipes = recipes ? recipes.slice(0, 3) : [];
  // For weekly best, ideally sort by view count, but for now just use latest
  const weeklyRecipes = recipes ? [...recipes].sort((a,b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5) : [];
  const allRecipes = recipes || [];

  const models = ["All Models", "GPT-4", "Claude 3", "Midjourney", "Gemini", "Llama 3"];
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
      
      {/* 1. Hero Section (Black & White Chef Concept) */}
      <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-[#0a0a0a] pb-32">
        <div className="absolute inset-0 z-0">
             {/* Dramatic Spotlight Effect */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-[#020617]/50 to-[#020617] z-10" />
        </div>

        <div className="container px-4 z-20 text-center space-y-8 animate-in fade-in zoom-in duration-1000 mt-10">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-slate-300 mb-4 backdrop-blur-md shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
                <span className="font-semibold tracking-wide">AI Culinary Class Wars</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white pb-2 drop-shadow-2xl">
                <span className="block text-slate-500 text-3xl md:text-5xl font-bold tracking-tight mb-2">계급장 떼고 붙자</span>
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

      {/* 2. Main Banner (Managed by Admin) */}
      <MainBanner />

      {/* 3. Weekly Ranking Section */}
      <section className="container px-4 py-8">
         <div className="flex items-center gap-2 mb-6">
            <div className="bg-yellow-500/10 p-2 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">🏆 실시간 주간 랭킹</h2>
         </div>
         <WeeklyRanking />
      </section>

      {/* 1. Featured Section - Today's Pick (Bento Style) */}
      <section className="container px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <h2 className="text-xl font-bold tracking-tight text-white">오늘의 추천 레시피</h2>
        </div>
        
        <BentoGrid>
          {featuredRecipes.length > 0 ? featuredRecipes.map((recipe: any, i: number) => {
            return (
              <BentoGridItem
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                user={recipe} // Pass the whole recipe object to access profiles safely inside
                time={recipe.cooking_time_minutes}
                header={
                   recipe.image_url ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                     <Image 
                         src={recipe.image_url} 
                         alt={recipe.title} 
                         fill
                         className="object-cover transition-transform duration-500 group-hover/bento:scale-105"
                         sizes="(max-width: 768px) 100vw, 33vw"
                     />
                    </div>
                   ) : (
                    <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${i === 0 ? 'from-zinc-800 via-zinc-900 to-black' : i === 1 ? 'from-slate-800 via-slate-900 to-black' : 'from-stone-800 via-stone-900 to-black'}`} />
                   )
                }
                icon={<Terminal className="h-4 w-4 text-slate-500" />}
                className=""
                i={i}
              />
            );
          }) : (
             <div className="md:col-span-3 h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5 text-slate-500">
               <div className="flex flex-col items-center gap-2">
                 <Sparkles className="h-8 w-8 opacity-20" />
                 <span>추천 프롬프트를 준비 중입니다.</span>
               </div>
             </div>
          )}
        </BentoGrid>
      </section>

      {/* 2. Weekly Best - Horizontal Scroll */}
      <section className="container px-4 py-8 border-t border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold tracking-tight text-white">실시간 인기 레시피</h2>
          </div>
          <Link href="#" className="text-sm text-slate-400 hover:text-white flex items-center transition-colors">
            전체보기 <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {weeklyRecipes.length > 0 ? weeklyRecipes.map((recipe: any) => (
              <CarouselItem key={recipe.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link href={`/recipe/${recipe.id}`} className="block group">
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900/50 aspect-square mb-3 relative group-hover:border-white/30 transition-all shadow-lg">
                    {recipe.image_url ? (
                      <Image 
                          src={recipe.image_url} 
                          alt="" 
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800/50 flex items-center justify-center">
                        <Terminal className="h-8 w-8 text-slate-700" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-red-400" /> {recipe.view_count || 0}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-indigo-400 text-slate-200 transition-colors">{recipe.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{recipe.description}</p>
                </Link>
              </CarouselItem>
            )) : (
              <CarouselItem className="pl-4 basis-full text-center py-10 text-slate-500 text-sm">
                데이터가 충분하지 않습니다.
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="bg-slate-900/80 border-white/10 hover:bg-indigo-600 hover:text-white hover:border-indigo-500" />
            <CarouselNext className="bg-slate-900/80 border-white/10 hover:bg-indigo-600 hover:text-white hover:border-indigo-500" />
          </div>
        </Carousel>
      </section>

      {/* 3. Filters Section */}
      <section className="container px-4 py-8 space-y-4">
        {/* Category Filter Row */}
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

      {/* 4. Main Grid Section */}
      <section className="container px-4 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="h-5 w-5 text-indigo-500" />
          <h2 className="text-xl font-bold tracking-tight text-white">{currentCategory === '전체' ? '전체 레시피' : `${currentCategory} 레시피`}</h2>
        </div>

        {allRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-lg bg-white/5">
            <Command className="h-10 w-10 text-slate-600 mb-4" />
            <p className="text-slate-500 text-sm">등록된 레시피가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {allRecipes.map((recipe: any) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
