import { createClient } from "@/utils/supabase/server";
import { assignRecipesToMe, fixMyUsername } from "./actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="p-10 text-white">로그인이 필요합니다.</div>;

  // 1. 내 프로필 정보 조회
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 2. 전체 레시피 리스트 조회 (JOIN 제거하여 에러 방지)
  const { data: recipes, error: recipeError } = await supabase
    .from("recipes")
    .select("id, title, user_id")
    .order("created_at", { ascending: false })
    .limit(20);

  if (recipeError) console.error(recipeError);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-10 font-mono">
      <h1 className="text-3xl font-bold text-red-500 mb-8 border-b border-red-900 pb-4">
        🛠️ 데이터 긴급 복구 센터
      </h1>

      <div className="grid grid-cols-2 gap-10">
        {/* 왼쪽: 내 정보 */}
        <div className="space-y-6">
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">1. 내 계정 상태</h2>
            <div className="space-y-2 text-sm">
              <p>Email: <span className="text-yellow-400">{user.email}</span></p>
              <p>UUID: <span className="text-slate-500">{user.id}</span></p>
              <p className="border-t border-slate-700 pt-2 mt-2">
                DB 닉네임: 
                <span className={`ml-2 px-2 py-0.5 rounded font-bold ${myProfile?.username === 'juuuno' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {myProfile?.username || "(없음/NULL)"}
                </span>
              </p>
            </div>
            
            <form action={fixMyUsername} className="mt-4">
               <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
                 닉네임 'juuuno'로 강제 변경하기
               </Button>
            </form>
          </section>

          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">2. 레시피 소유권</h2>
            <p className="text-sm text-slate-400 mb-4">
              내 레시피가 안 보인다면, 소유권이 끊겨있는 것입니다.
            </p>
            <form action={assignRecipesToMe}>
               <Button variant="destructive" className="w-full">
                 모든 레시피를 내 소유로 가져오기
               </Button>
            </form>
          </section>
        </div>

        {/* 오른쪽: 레시피 현황 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
          <h2 className="text-xl font-bold text-white mb-4">3. 현재 등록된 레시피 (최신순)</h2>
          <table className="w-full text-xs text-left">
            <thead className="text-slate-500 border-b border-slate-700">
              <tr>
                <th className="pb-2">제목</th>
                <th className="pb-2">작성자(DB값)</th>
                <th className="pb-2">내 것인가?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recipes?.map((r) => {
                const isMine = r.user_id === user.id;
                
                return (
                  <tr key={r.id}>
                    <td className="py-2 text-white">{r.title}</td>
                    <td className="py-2">
                       <span className="text-xs font-mono text-slate-500">{r.user_id}</span>
                       {/* <br/><span className={authorName === 'Editor' ? 'text-red-400 font-bold' : 'text-slate-400'}>
                        {authorName}
                      </span> */}
                    </td>
                    <td className="py-2">
                      {isMine ? (
                        <span className="text-green-500">✅ YES</span>
                      ) : (
                        <span className="text-red-500">❌ NO (UUID 불일치)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
