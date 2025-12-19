import { createClient } from "@/utils/supabase/server";
import { RecipeCard } from "@/components/recipe-card";
import Link from "next/link";
import { Terminal } from "lucide-react";

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
    )
}

export async function RecipeRecommendations({ currentId }: { currentId: string }) {
  const supabase = await createClient();

  // Fetch Related Recipes (Simple logic: latest 4 excluding current)
  // Introduced explicit 500ms delay to demonstrate streaming if needed, but removed for production speed.
  const { data: relatedRecipes } = await supabase
    .from("recipes")
    .select("*, profiles(*)")
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="mt-20 pt-10 border-t border-white/5">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center">
                <SparklesIcon className="mr-2 h-6 w-6 text-yellow-500" />
                이런 레시피는 어때요?
            </h3>
            <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                전체보기 &rarr;
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedRecipes && relatedRecipes.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                relatedRecipes.map((item: any) => (
                    <RecipeCard key={item.id} recipe={item} />
                ))
            ) : (
                <div className="col-span-4 py-16 rounded-3xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <p>관련된 레시피를 찾을 수 없습니다.</p>
                </div>
            )}
        </div>
    </div>
  );
}
