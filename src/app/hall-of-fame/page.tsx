import { createClient } from "@/utils/supabase/server";
import { Crown, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // Cache for 60s

export default async function HallOfFamePage() {
  const supabase = await createClient();
  
  // Join recipes table
  const { data: entries, error } = await supabase
    .from('hall_of_fame')
    .select(`
        *,
        recipes (
            id,
            title,
            image_url,
            user_id,
            profiles (username, avatar_url)
        )
    `)
    .order('induction_date', { ascending: false });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-20 px-4">
      <div className="container max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-400">
            <Crown className="h-4 w-4" /> Hall of Fame
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            명예의 전당
          </h1>
          <p className="text-slate-400 text-lg">
            역대 최고의 레시피들을 기록합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entries && entries.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                entries.map((entry: any) => {
                    const recipe = entry.recipes;
                    if (!recipe) return null;

                    return (
                        <Link key={entry.id} href={`/recipe/${recipe.id}`} className="group relative">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-900 border border-white/10 group-hover:border-yellow-500/50 transition-all shadow-2xl group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                                {/* Image */}
                                {recipe.image_url ? (
                                    <Image 
                                        src={recipe.image_url} 
                                        alt={recipe.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800" />
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-yellow-500 text-black font-bold border-0 hover:bg-yellow-400">
                                                {entry.award_title || "Legendary"}
                                            </Badge>
                                            <div className="text-xs text-yellow-500/80 font-mono flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(entry.induction_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-yellow-400 transition-colors">
                                            {recipe.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-300 pt-2">
                                            {recipe.profiles?.avatar_url && (
                                                <Image 
                                                    src={recipe.profiles.avatar_url} 
                                                    alt={recipe.profiles.username} 
                                                    width={20} 
                                                    height={20} 
                                                    className="rounded-full" 
                                                />
                                            )}
                                            <span>{recipe.profiles?.username || "Unknown"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })
            ) : (
                <div className="col-span-full py-20 text-center text-slate-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <Crown className="h-10 w-10 mx-auto mb-4 opacity-20" />
                    <p>아직 등재된 전설이 없습니다.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
