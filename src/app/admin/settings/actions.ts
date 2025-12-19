"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const announcement_text = formData.get("announcement_text") as string;
  const is_announcement_visible = formData.get("is_announcement_visible") === "on";
  const maintenance_mode = formData.get("maintenance_mode") === "on";

  const { error } = await supabase
    .from("site_settings")
    .update({ 
        announcement_text, 
        is_announcement_visible, 
        maintenance_mode,
        updated_at: new Date().toISOString()
    })
    .eq("id", 1); // Singleton

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout"); // Revalidate everything
  return { success: true };
}
