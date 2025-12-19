import { createClient } from "@/utils/supabase/server";
import { SearchInput } from "@/components/admin/search-input";
import { DeleteRecipeButton } from "@/components/admin/delete-button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

export default async function AdminRecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  // Basic query
  let query = supabase
    .from("recipes")
    .select("*, profiles(username, email)")
    .order("created_at", { ascending: false });

  // Apply search
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: recipes, error } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">레시피 관리</h2>
            <p className="text-slate-400 text-sm mt-1">총 {recipes?.length || 0}개의 레시피가 조회되었습니다.</p>
        </div>
        <SearchInput placeholder="제목으로 검색..." />
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#0f172a] text-slate-400 font-medium border-b border-white/5">
                    <tr>
                        <th className="px-6 py-4">썸네일</th>
                        <th className="px-6 py-4">정보</th>
                        <th className="px-6 py-4">통계</th>
                        <th className="px-6 py-4">작성자</th>
                        <th className="px-6 py-4 text-right">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {recipes?.map((recipe: any) => (
                        <tr key={recipe.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4 w-24">
                                <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden border border-white/10 relative">
                                    {recipe.image_url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={recipe.image_url} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <Link href={`/recipe/${recipe.id}`} className="font-semibold text-slate-200 hover:text-indigo-400 transition-colors line-clamp-1">
                                        {recipe.title}
                                    </Link>
                                    <span className="text-xs text-slate-500 truncate max-w-[300px]">
                                        {recipe.description}
                                    </span>
                                    <div className="flex gap-2 mt-1">
                                        {recipe.category && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-slate-800 text-slate-400">{recipe.category}</Badge>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 text-xs text-slate-400">
                                    <span>조회 {recipe.view_count || 0}</span>
                                    <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-slate-200 text-sm font-medium">{recipe.profiles?.username || "Unknown"}</span>
                                    <span className="text-slate-500 text-xs">{recipe.profiles?.email}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DeleteRecipeButton id={recipe.id} />
                            </td>
                        </tr>
                    ))}
                    
                    {(!recipes || recipes.length === 0) && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                검색 결과가 없습니다.
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
