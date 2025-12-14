"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimAllRecipes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "로그인이 필요합니다." };

  // 모든 레시피의 주인을 '나'로 변경
  const { error, count } = await supabase
    .from("recipes")
    .update({ user_id: user.id })
    // 조건 없이 모든 레시피를 가져오거나, 특정 조건(예: user_id가 없는 것들)을 걸 수 있지만
    // 지금은 "다 내 것"으로 만드는 게 목적이므로 필터 없이(또는 현재 Editor 소유인 것만) 진행합니다.
    // 안전을 위해 id가 존재하는 모든 레시피를 대상으로 합니다.
    .neq('id', '00000000-0000-0000-0000-000000000000'); 

  if (error) {
    console.error(error);
    return { error: "업데이트 실패: " + error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, count };
}
