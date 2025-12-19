"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function ViewCounter({ recipeId }: { recipeId: string }) {
  useEffect(() => {
    const increment = async () => {
      const supabase = createClient();
      await supabase.rpc("increment_view_count", { p_recipe_id: recipeId });
    };
    increment();
  }, [recipeId]);

  return null; // 화면에는 아무것도 보이지 않음
}
