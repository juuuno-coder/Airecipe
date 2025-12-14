"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Create a new collection
export async function createCollection(name: string, isPrivate: boolean = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("collections")
    .insert({
      user_id: user.id,
      name,
      is_public: !isPrivate,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/profile");
  return data;
}

// 2. Add recipe to collection
export async function addToCollection(collectionId: string, recipeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("collection_items")
    .insert({
      collection_id: collectionId,
      recipe_id: recipeId,
    });

  if (error) {
      if (error.code === '23505') return; // Already exists, ignore
      throw new Error(error.message);
  }
  revalidatePath(`/recipe/${recipeId}`);
}

// 3. Remove recipe from collection
export async function removeFromCollection(collectionId: string, recipeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("collection_items")
    .delete()
    .match({
      collection_id: collectionId,
      recipe_id: recipeId,
    });

  if (error) throw new Error(error.message);
  revalidatePath(`/recipe/${recipeId}`);
}

// 4. Fetch my collections with Status (is recipe included?)
export async function getMyCollectionsWithStatus(recipeId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
  
    // Fetch collections
    const { data: collections } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
  
    if (!collections) return [];

    // Check which ones contain this recipe
    const { data: items } = await supabase
        .from("collection_items")
        .select("collection_id")
        .eq("recipe_id", recipeId)
        .in("collection_id", collections.map(c => c.id));

    const includedIds = new Set(items?.map(i => i.collection_id));

    return collections.map(c => ({
        ...c,
        hasRecipe: includedIds.has(c.id)
    }));
  }
