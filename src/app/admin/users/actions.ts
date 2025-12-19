"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: 'admin' | 'user' | 'banned') {
  const supabase = await createClient();
  
  // TODO: Check if current user is admin strictly
  
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Update role failed:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
