import { createClient } from "@/utils/supabase/server";
import { SearchInput } from "@/components/admin/search-input";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  // Basic query
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply search
  if (q) {
    query = query.or(`username.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: users, error } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">유저 관리</h2>
            <p className="text-slate-400 text-sm mt-1">총 {users?.length || 0}명의 회원이 가입했습니다.</p>
        </div>
        <SearchInput placeholder="닉네임 또는 이메일 검색..." />
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#0f172a] text-slate-400 font-medium border-b border-white/5">
                    <tr>
                        <th className="px-6 py-4">유저 정보</th>
                        <th className="px-6 py-4">연락처 (Email)</th>
                        <th className="px-6 py-4">가입일</th>
                        <th className="px-6 py-4">권한 (Role)</th>
                        <th className="px-6 py-4 text-right">상태</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users?.map((user: any) => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border border-white/10">
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback className="bg-slate-800 text-xs">{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-200">{user.username || "이름 없음"}</span>
                                        <span className="text-xs text-slate-500 font-mono select-all decoration-slate-600 underline decoration-dashed underline-offset-2">ID: {user.id.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                                {user.email || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                                {new Date(user.created_at || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <UserRoleSelect userId={user.id} currentRole={user.role} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Badge variant="outline" className={`
                                    ${user.role === 'admin' ? 'border-red-500/30 text-red-400 bg-red-500/5' : ''}
                                    ${user.role === 'user' || !user.role ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : ''}
                                    ${user.role === 'banned' ? 'border-slate-500/30 text-slate-500 bg-slate-500/5' : ''}
                                `}>
                                    {user.role === 'admin' ? 'Active Admin' : (user.role === 'banned' ? 'Suspended' : 'Active')}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                    
                    {(!users || users.length === 0) && (
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
