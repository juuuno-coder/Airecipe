"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. 모든 레시피를 '나(로그인된 유저)'의 소유로 변경
export async function assignRecipesToMe() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "로그인이 필요합니다." };

  const { error, count } = await supabase
    .from("recipes")
    .update({ user_id: user.id })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // 모든 레시피 대상

  revalidatePath("/", "layout");
  return { message: error ? error.message : `성공! 총 ${count}개의 레시피를 내 소유로 가져왔습니다.` };
}

// 2. 내 닉네임을 강제로 'juuuno'로 고정
export async function fixMyUsername() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "로그인이 필요합니다." };

  // 프로필 테이블 업데이트
  const { error } = await supabase
    .from("profiles")
    .update({ username: "juuuno" })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  return { message: error ? error.message : "성공! 내 닉네임을 'juuuno'로 확정했습니다." };
}
