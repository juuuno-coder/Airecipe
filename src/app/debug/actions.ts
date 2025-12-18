"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. 모든 레시피를 '나(로그인된 유저)'의 소유로 변경
export async function assignRecipesToMe(_formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("recipes")
    .update({ user_id: user.id })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // 모든 레시피 대상

  revalidatePath("/", "layout");
}

// 2. 내 닉네임을 강제로 'juuuno'로 고정
export async function fixMyUsername(_formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 프로필 테이블 업데이트
  await supabase
    .from("profiles")
    .update({ username: "juuuno" })
    .eq("id", user.id);

  revalidatePath("/", "layout");
}
