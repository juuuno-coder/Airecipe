import { createClient } from "@/utils/supabase/server";
import { DeleteCommentButton } from "@/components/admin/delete-comment-button";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminCommentsPage() {
  const supabase = await createClient();

  // Fetch comments with author and recipe info
  const { data: comments, error } = await supabase
    .from("comments")
    .select(`
        *,
        profiles (username, email, avatar_url),
        recipes (id, title)
    `)
    .order("created_at", { ascending: false })
    .limit(50); // Show latest 50 for now

  return (
    <div className="space-y-6">
      <div>
            <h2 className="text-2xl font-bold text-white">최근 댓글 관리</h2>
            <p className="text-slate-400 text-sm mt-1">최근 작성된 댓글 50개를 보여줍니다.</p>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#0f172a] text-slate-400 font-medium border-b border-white/5">
                    <tr>
                        <th className="px-6 py-4">내용</th>
                        <th className="px-6 py-4">작성자</th>
                        <th className="px-6 py-4">레시피</th>
                        <th className="px-6 py-4">작성일</th>
                        <th className="px-6 py-4 text-right">삭제</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {comments?.map((comment: any) => (
                        <tr key={comment.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4 max-w-[300px]">
                                <p className="truncate text-slate-200">{comment.content}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-slate-400">{comment.profiles?.username || "익명"}</span>
                            </td>
                            <td className="px-6 py-4 max-w-[200px]">
                                <Link 
                                    href={`/recipe/${comment.recipes?.id}`} 
                                    className="text-indigo-400 hover:underline truncate block"
                                    target="_blank"
                                >
                                    {comment.recipes?.title || "삭제된 레시피"}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                                {new Date(comment.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DeleteCommentButton id={comment.id} />
                            </td>
                        </tr>
                    ))}
                    
                    {(!comments || comments.length === 0) && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                댓글이 없습니다.
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
