import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import CommentForm from "./comment-form";

export default async function CommentsSection({ recipeId }: { recipeId: string }) {
  const supabase = await createClient();
  
  // Fetch comments with user profiles
  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(*)")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-indigo-500" />
        댓글 <span className="text-slate-500 text-lg">({comments?.length || 0})</span>
      </h3>

      <CommentForm recipeId={recipeId} />

      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-indigo-500/10">
                <AvatarImage src={comment.profiles?.avatar_url} />
                <AvatarFallback className="bg-slate-800 text-slate-400">
                  {(comment.profiles?.username?.[0] || "?").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white text-sm">
                    {comment.profiles?.username || "알 수 없는 사용자"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
            첫 번째 댓글을 남겨보세요!
          </div>
        )}
      </div>
    </div>
  );
}
