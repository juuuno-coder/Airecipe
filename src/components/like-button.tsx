"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  recipeId: string;
  initialLiked: boolean;
  initialCount: number; // We might want to show global like count later
  userId?: string;
}

export function LikeButton({ recipeId, initialLiked, initialCount, userId, className }: LikeButtonProps & { className?: string }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const router = useRouter();
  const supabase = createClient();

  // Double check actual server state on mount to prevent sync errors
  useEffect(() => {
    // ... (rest of useEffect logic is fine, no need to change unless needed)
    if (userId) {
        const checkLikeStatus = async () => {
            const { data, error } = await supabase
                .from("likes")
                .select("*")
                .eq("user_id", userId)
                .eq("recipe_id", recipeId)
                .maybeSingle(); // Use maybeSingle to avoid error if not found
            
            if (!error) {
                // If data exists, it's liked. Sync state.
                const isActuallyLiked = !!data;
                if (isActuallyLiked !== liked) {
                    setLiked(isActuallyLiked);
                }
            }
        };
        checkLikeStatus();
    }
  }, [userId, recipeId, supabase]); // Removed liked dependency to avoid loop

  const toggleLike = async () => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    } // <--- Added missing brace here

    if (loading) return;
    setLoading(true);

    // 1. Optimistic Update (Instant feedback)
    const previousLiked = liked;
    const previousCount = likeCount;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    // 2. Perform Server Action
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("로그인이 필요합니다.");
            router.push("/login");
            // Revert
            setLiked(previousLiked);
            setLikeCount(previousCount);
            return;
        }

        if (newLiked) {
             const { error } = await supabase
                .from("likes")
                .insert({ user_id: user.id, recipe_id: recipeId });
             if (error) throw error;
             toast.success("이 레시피를 좋아합니다!");
        } else {
             const { error } = await supabase
                .from("likes")
                .delete()
                .match({ user_id: user.id, recipe_id: recipeId });
             if (error) throw error;
             toast.success("좋아요를 취소했습니다.");
        }
        router.refresh(); // Refresh to update counts if displayed elsewhere
    } catch (error) {
        // 3. Revert on Error
        console.error("Like toggle failed:", error);
        setLiked(previousLiked);
        setLikeCount(previousCount);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error("요청 실패: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
        variant="outline" 
        size="lg" 
        onClick={toggleLike}
        className={cn(
            "flex-1 h-12 rounded-xl transition-all duration-300 border-white/10 bg-white/5 whitespace-nowrap",
            liked ? "bg-pink-500/10 text-pink-500 border-pink-500/50 hover:bg-pink-500/20" : "text-slate-300 hover:text-pink-400 hover:bg-white/10 hover:border-white/20",
            className
        )}
    >
        <Heart className={cn("mr-2 h-5 w-5", liked && "fill-current")} />
        {liked ? "좋아요" : "좋아요"}
    </Button>
  );
}
