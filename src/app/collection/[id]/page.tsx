
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { ArrowLeft, Folder, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Collection Info
  const { data: collection, error: colError } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (colError || !collection) {
    console.error("Collection not found:", colError);
    return notFound();
  }

  // 2. Fetch Recipes in Collection - 2-Step Process (Safer)
  // Step A: Get Recipe IDs
  const { data: items, error: itemsError } = await supabase
    .from("collection_items")
    .select("recipe_id")
    .eq("collection_id", id);
  
  // Step B: Fetch Recipes by ID
  let recipes: any[] = [];
  if (items && items.length > 0) {
      const recipeIds = items.map(item => item.recipe_id);
      
      // Optimize: Select only necessary fields for the card to reduce payload size
      // Use explicit inner join syntax or standard relation if FK exists.
      // Since fixes were applied, we assume relationships work.
      const { data: recipesData, error } = await supabase
        .from("recipes")
        .select(`
            id,
            title, 
            description, 
            image_url, 
            difficulty, 
            cooking_time_minutes, 
            created_at,
            user_id,
            profiles (username, avatar_url),
            likes (count)
        `)
        .in("id", recipeIds)
        .order("created_at", { ascending: false });

      if (recipesData) {
        recipes = recipesData;
      }
      
      if (error) {
           console.error("Error fetching collection recipes:", error);
      }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-white/5 rounded-full -ml-2">
            <Link href="/profile">
              <ArrowLeft className="h-5 w-5 text-slate-400" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-0.5">
                <Folder className="h-3.5 w-3.5" /> 컬렉션
            </div>
            <h1 className="text-xl font-bold text-white">{collection.name}</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
               <Terminal className="h-8 w-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">컬렉션이 비어있습니다</h2>
            <p className="text-slate-400 max-w-md text-center">
              아직 이 컬렉션에 저장된 레시피가 없습니다. <br/>
              다양한 레시피를 둘러보고 마음에 드는 것을 저장해보세요.
            </p>
            <Button asChild className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white">
                <Link href="/">레시피 탐색하기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
