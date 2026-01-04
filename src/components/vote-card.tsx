import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperVoteButton } from "@/components/super-vote-button";
import { Trophy } from "lucide-react";

export async function VoteCard({ recipeId }: { recipeId: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-md shadow-xl overflow-hidden ring-1 ring-yellow-500/30 rounded-3xl mb-6">
            <CardHeader className="pb-2 border-b border-yellow-500/10">
                <CardTitle className="text-lg font-bold text-amber-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Weekly Challenge
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-amber-100/70">
                    이 레시피가 마음에 드시나요? <br/>
                    <strong className="text-amber-200">추천하기</strong>를 눌러 주간 베스트 레시피로 만들어주세요!
                </p>
                <SuperVoteButton recipeId={recipeId} userId={user?.id} />
            </CardContent>
        </Card>
    );
}
