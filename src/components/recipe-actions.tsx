import { createClient } from "@/utils/supabase/server";
import { Link } from "lucide-react"; // Wait, wrong import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SuperVoteButton } from "@/components/super-vote-button";
import { LikeButton } from "@/components/like-button";
import { CollectionModal } from "@/components/collection-modal"; 
import { Settings, Bookmark, Cpu } from "lucide-react";
import NextLink from "next/link"; // Specific import to avoid conflict

export async function RecipeActions({ recipeId, initialLikeCount, authorId }: { recipeId: string, initialLikeCount: number, authorId: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Like Status (Only if user exists)
    let isLiked = false;
    if (user) {
        const { data: likeData } = await supabase
            .from("likes")
            .select("id")
            .eq("user_id", user.id)
            .eq("recipe_id", recipeId)
            .maybeSingle(); 
        if (likeData) isLiked = true;
    }

    const isOwner = user?.id === authorId;

    return (
        <Card className="border-0 bg-gradient-to-b from-indigo-900/20 to-slate-900/20 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 rounded-3xl">
            <CardHeader className="pb-2 border-b border-white/5">
                    <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Actions
                    </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <SuperVoteButton recipeId={recipeId} userId={user?.id} />

                <Button className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 rounded-xl transition-all hover:scale-[1.02]" asChild>
                    <NextLink href="/create">
                        <Cpu className="mr-2 h-5 w-5" /> 나도 레시피 등록하기
                    </NextLink>
                </Button>
                
                <div className="flex flex-wrap gap-3">
                    <LikeButton 
                        recipeId={recipeId} 
                        initialCount={initialLikeCount}
                        initialLiked={isLiked}
                        userId={user?.id}
                    />
                    {user ? (
                        <CollectionModal recipeId={recipeId} userId={user.id} />
                    ) : (
                        <Button variant="outline" className="flex-1 rounded-xl h-12 border-white/10" asChild>
                            <NextLink href="/login">
                                <Bookmark className="mr-2 h-4 w-4" /> 저장
                            </NextLink>
                        </Button>
                    )}
                </div>

                {isOwner && (
                    <Button variant="outline" size="sm" asChild className="w-full mt-2 text-slate-300 hover:text-white border-white/10 hover:bg-white/5 rounded-lg">
                        <NextLink href={`/recipe/${recipeId}/edit`}>
                            <Settings className="mr-2 h-4 w-4" /> 레시피 수정
                        </NextLink>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
