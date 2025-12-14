"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const recipeId = formData.get("recipeId") as string;
  const content = formData.get("content") as string;

  if (!content || content.trim().length === 0) {
    return { error: "내용을 입력해주세요." };
  }

  const { error } = await supabase
    .from("comments")
    .insert({
      recipe_id: recipeId,
      user_id: user.id,
      content: content,
    });

  if (error) {
    console.error("Comment error:", error);
    return { error: "댓글 작성 중 오류가 발생했습니다." };
  }

  revalidatePath(`/recipe/${recipeId}`);
  return { success: true };
}
