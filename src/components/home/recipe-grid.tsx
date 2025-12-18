import { createClient } from "@/utils/supabase/server";
import { RecipeCard } from "@/components/recipe-card";
import { Layers, Command } from "lucide-react";

export async function AllRecipesGrid({ category }: { category: string }) {
  const supabase = await createClient();

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
    .limit(12); // Paging: Start with 12 items (was 50)

  if (category && category !== "전체") {
      query = query.eq("category", category);
  }

  const { data: recipes } = await query;
  const allRecipes = recipes || [];

  return (
    <section className="container px-4 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="h-5 w-5 text-indigo-500" />
          <h2 className="text-xl font-bold tracking-tight text-white">{category === '전체' ? '전체 레시피' : `${category} 레시피`}</h2>
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
  );
}
