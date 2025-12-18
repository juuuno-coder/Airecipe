import { createClient } from "@/utils/supabase/server";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TrendingUp, ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export async function WeeklyBestRecipes({ category }: { category: string }) {
  const supabase = await createClient();

  // Optimize: Fetch top 5 by view_count
  let query = supabase
    .from("recipes")
    .select("id, title, description, image_url, view_count")
    .order("view_count", { ascending: false }) // Sort by views on DB side!
    .limit(10); // Fetch a bit more for carousel

  if (category && category !== "전체") {
    query = query.eq("category", category);
  }

  const { data: recipes } = await query;
  const weeklyRecipes = recipes || [];

  return (
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
  );
}
