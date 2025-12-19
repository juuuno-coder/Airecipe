import { createClient } from "@/utils/supabase/server";
import { AdminDashboardCharts } from "@/components/admin/admin-dashboard-charts";
import { Users, FileText, Eye, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const revalidate = 0; // Always fresh for admin

export default async function AdminPage() {
  const supabase = await createClient();

  // Call the SQL function we defined
  const { data: stats, error } = await supabase.rpc('get_admin_stats');
  
  // Fallback for missing SQL function
  if (error) {
      console.error("Admin stats error:", error);
      return (
          <div className="p-10 text-center text-red-400 bg-red-900/10 rounded-xl border border-red-500/20">
              <h3 className="text-xl font-bold mb-2">통계 데이터를 불러올 수 없습니다.</h3>
              <p>setup_admin_stats.sql 스크립트를 Supabase에서 실행했는지 확인해주세요.</p>
              <pre className="mt-4 bg-black/50 p-4 rounded text-left text-xs overflow-auto">
                  {JSON.stringify(error, null, 2)}
              </pre>
          </div>
      );
  }

  // Safe destructuring
  const { total_users, total_recipes, total_views, recent_recipes, daily_trends, category_stats } = stats as any || {};

  return (
    <div className="space-y-8">
      
      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="총 유저 수" value={total_users} icon={<Users className="h-4 w-4 text-indigo-400" />} />
        <StatCard title="총 레시피" value={total_recipes} icon={<FileText className="h-4 w-4 text-green-400" />} />
        <StatCard title="총 조회수" value={total_views} icon={<Eye className="h-4 w-4 text-blue-400" />} />
        <StatCard title="일일 평균" value={daily_trends?.[daily_trends.length - 1]?.count || 0} subValue="오늘 등록" icon={<TrendingUp className="h-4 w-4 text-orange-400" />} />
      </div>

      {/* 2. Charts Section */}
      <AdminDashboardCharts dailyTrends={daily_trends || []} categoryStats={category_stats || []} />

      {/* 3. Recent Activity Table */}
      <div className="rounded-3xl bg-slate-900/50 border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-white">최근 등록된 레시피</h3>
            <Link href="/" className="text-xs text-indigo-400 hover:underline">전체 보기</Link>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-slate-400 font-medium">
                    <tr>
                        <th className="px-6 py-4">레시피 제목</th>
                        <th className="px-6 py-4">작성자</th>
                        <th className="px-6 py-4">조회수</th>
                        <th className="px-6 py-4">등록일</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {recent_recipes?.map((recipe: any) => (
                        <tr key={recipe.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-200">
                                <Link href={`/recipe/${recipe.id}`} className="hover:text-indigo-400 truncate block max-w-[200px]">
                                    {recipe.title}
                                </Link>
                            </td>
                            <td className="px-6 py-4 flex items-center gap-2 text-slate-400">
                                <User className="w-4 h-4" />
                                {recipe.author_name || "익명"}
                            </td>
                            <td className="px-6 py-4 text-slate-400 font-mono">
                                {recipe.view_count}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                                {new Date(recipe.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    {(!recent_recipes || recent_recipes.length === 0) && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">데이터가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value, subValue, icon }: { title: string, value: string | number, subValue?: string, icon: React.ReactNode }) {
    return (
        <Card className="bg-slate-900/50 border-white/5 text-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value?.toLocaleString() || 0}</div>
                {subValue && (
                    <p className="text-xs text-slate-500 mt-1">
                        {subValue}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
