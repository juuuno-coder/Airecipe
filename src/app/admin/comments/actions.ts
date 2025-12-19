"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCommentAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("comments").delete().eq("id", id);
  
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/comments");
  return { success: true };
}
