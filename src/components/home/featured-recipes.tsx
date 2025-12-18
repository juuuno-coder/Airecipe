import { createClient } from "@/utils/supabase/server";
import { BentoGrid, BentoGridItem } from "@/components/bento-grid";
import { Terminal, Sparkles } from "lucide-react";
import Image from "next/image";

export async function FeaturedRecipes({ category }: { category: string }) {
  const supabase = await createClient();
  
  // Optimize: Fetch only 3 items needed for this section
  let query = supabase
    .from("recipes")
    .select("id, title, description, image_url, cooking_time_minutes, user_id, profiles(username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(3);

  if (category && category !== "전체") {
    query = query.eq("category", category);
  }

  const { data: recipes } = await query;
  const featuredRecipes = recipes || [];

  return (
    <section className="container px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        <h2 className="text-xl font-bold tracking-tight text-white">오늘의 추천 레시피</h2>
      </div>

      <BentoGrid>
        {featuredRecipes.length > 0 ? featuredRecipes.map((recipe: any, i: number) => (
          <BentoGridItem
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            user={recipe}
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
        )) : (
          <div className="md:col-span-3 h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5 text-slate-500">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="h-8 w-8 opacity-20" />
              <span>추천 프롬프트를 준비 중입니다.</span>
            </div>
          </div>
        )}
      </BentoGrid>
    </section>
  );
}
