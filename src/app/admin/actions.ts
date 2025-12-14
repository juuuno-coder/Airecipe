"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function inductWeeklyWinner() {
    const supabase = await createClient();

    // 1. Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Unauthorized" };
    }
    // TODO: Add stricter admin check here if needed

    // 2. Get Top 1 Ranking
    const { data: rankings, error: rankingError } = await supabase
        .from('weekly_rankings_view')
        .select('*')
        .order('score', { ascending: false })
        .limit(1);

    if (rankingError) return { error: "Failed to fetch rankings: " + rankingError.message };
    if (!rankings || rankings.length === 0) return { error: "No rankings found for this week." };

    const topRecipe = rankings[0];

    // 3. Generate Title
    const now = new Date();
    // Calculate week number roughly or just use exact date
    const title = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${Math.ceil(now.getDate() / 7)}주차 베스트`;

    // 4. Insert into Hall of Fame
    const { error: insertError } = await supabase
        .from('hall_of_fame')
        .insert({
            recipe_id: topRecipe.recipe_id,
            induction_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            award_title: title
        });

    if (insertError) {
        if (insertError.code === '23505') {
            return { error: "This recipe is already in the Hall of Fame." };
        }
        return { error: "Failed to induct: " + insertError.message };
    }

    revalidatePath('/hall-of-fame');
    revalidatePath('/admin/dashboard');

    return { 
        success: true, 
        message: `Successfully inducted "${topRecipe.title}" into Hall of Fame!`,
        data: topRecipe
    };
}
