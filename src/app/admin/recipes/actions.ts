"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteRecipeAction(id: string) {
  const supabase = await createClient();
  
  // TODO: Check admin role here once role column is populated
  
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  
  if (error) {
    console.error("Delete failed:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/recipes");
  return { success: true };
}
