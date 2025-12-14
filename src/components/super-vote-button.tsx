"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

export function SuperVoteButton({ 
  recipeId, 
  userId 
}: { 
  recipeId: string; 
  userId?: string 
}) {
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false); // Optimistic UI state could be enhanced by checking DB on load, but for now simple local state

  const handleVote = async () => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (voted) {
        toast.info("이미 추천하셨습니다.");
        return;
    }

    setLoading(true);
    const supabase = createClient();
    
    // Check if already voted (Client side check for better UX, though RLS handles safety)
    const { data: existing } = await supabase.from('weekly_votes').select('id').eq('user_id', userId).eq('recipe_id', recipeId).single();
    
    if (existing) {
        setVoted(true);
        setLoading(false);
        toast.info("이미 추천하셨습니다.");
        return;
    }

    // Vote
    const { error } = await supabase.from('weekly_votes').insert({
        user_id: userId,
        recipe_id: recipeId
    });

    if (error) {
        toast.error("투표 중 오류가 발생했습니다: " + error.message);
    } else {
        setVoted(true);
        toast.success("🏆 강력 추천 완료! 이번 주 랭킹 점수가 올라갔습니다.");
    }
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleVote} 
      className={cn(
          "w-full h-12 text-lg font-bold transition-all hover:scale-[1.02] mb-2",
          voted 
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700"
            : "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg shadow-yellow-900/20"
      )}
      disabled={loading || voted}
    >
        {voted ? (
            <>
                <Crown className="mr-2 h-5 w-5 text-slate-600" /> 추천 완료
            </>
        ) : (
            <>
                <Crown className="mr-2 h-5 w-5 fill-white animate-pulse" /> 이번 주 우수 레시피 추천! (+3점)
            </>
        )}
    </Button>
  );
}
