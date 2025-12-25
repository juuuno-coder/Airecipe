import { createClient } from "@/utils/supabase/server";
import { SearchInput } from "@/components/admin/search-input";
import { DeleteRecipeButton } from "@/components/admin/delete-button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CategoryFilter, SortSelect } from "@/components/admin/recipe-filters";
import { Eye, Heart, Calendar, User, LayoutGrid } from "lucide-react";
import Image from "next/image";

export const revalidate = 0;

export default async function AdminRecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;
  const supabase = await createClient();

  // 1. Fetch available categories for the filter
  const { data: catData } = await supabase.from("recipes").select("category");
  const uniqueCategories = Array.from(new Set(catData?.map(r => r.category).filter(Boolean))) as string[];

  // 2. Build Query
  let query = supabase
    .from("recipes")
    .select("*, profiles(username, email), likes:likes(count)", { count: "exact" });

  // Apply filters
  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);

  // Apply sorting
  switch (sort) {
    case "oldest": query = query.order("created_at", { ascending: true }); break;
    case "views": query = query.order("view_count", { ascending: false }); break;
    case "popular": 
        // Note: PostgREST doesn't support sorting by joined count directly easily without RPC
        // For now, let's stick to simple ones or a different approach
        query = query.order("created_at", { ascending: false }); 
        break;
    default: query = query.order("created_at", { ascending: false });
  }

  const { data: recipes, count } = await query;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">컨텐츠 라이브러리</h2>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                    <LayoutGrid className="w-3 h-3" />
                    총 <span className="text-indigo-400 font-bold">{count || 0}</span>개의 레시피가 등록되어 있습니다.
                </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <SortSelect />
                <CategoryFilter categories={uniqueCategories} />
                <SearchInput placeholder="레시피 제목 검색..." />
            </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-950/50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-white/5">
                    <tr>
                        <th className="px-6 py-5">레시피 정보</th>
                        <th className="px-6 py-5">성과 지표</th>
                        <th className="px-6 py-5">작성자 정보</th>
                        <th className="px-6 py-5">등록 일시</th>
                        <th className="px-6 py-5 text-right w-20">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {recipes?.map((recipe: any) => (
                        <tr key={recipe.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-xl bg-slate-800 overflow-hidden border border-white/10 shrink-0">
                                        {recipe.image_url ? (
                                            <Image src={recipe.image_url} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-xs">NO IMG</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <Link href={`/recipe/${recipe.id}`} target="_blank" className="font-bold text-slate-200 hover:text-indigo-400 transition-colors truncate">
                                            {recipe.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            {recipe.category && (
                                                <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                                    {recipe.category}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-slate-500 line-clamp-1">{recipe.description}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-5">
                                    <div className="flex flex-col items-center gap-0.5">
                                        <div className="flex items-center gap-1.5 text-slate-300 font-mono font-bold">
                                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                                            {recipe.view_count?.toLocaleString() || 0}
                                        </div>
                                        <span className="text-[9px] text-slate-600 uppercase font-black tracking-tighter">Views</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-0.5">
                                        <div className="flex items-center gap-1.5 text-indigo-400 font-mono font-bold">
                                            <Heart className="w-3.5 h-3.5 text-indigo-500/50" />
                                            {recipe.likes?.[0]?.count || 0}
                                        </div>
                                        <span className="text-[9px] text-slate-600 uppercase font-black tracking-tighter">Likes</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                        {recipe.profiles?.username?.[0] || 'U'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-200 text-xs font-bold flex items-center gap-1">
                                            <User className="w-2.5 h-2.5 text-slate-500" />
                                            {recipe.profiles?.username || "익명"}
                                        </span>
                                        <span className="text-slate-600 text-[10px] truncate max-w-[120px]">{recipe.profiles?.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(recipe.created_at).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DeleteRecipeButton id={recipe.id} />
                            </td>
                        </tr>
                    ))}
                    
                    {(!recipes || recipes.length === 0) && (
                        <tr>
                            <td colSpan={5} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center gap-2 opacity-20">
                                    <LayoutGrid className="w-12 h-12 text-slate-400" />
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Data Found</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
