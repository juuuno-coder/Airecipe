-- [Performance Optimization] Add Indexes for Fast Lookup
-- Run this to speed up Home Page and Collections

-- 1. Recipes Indexes
-- Used for sorting by date (Home Page)
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
-- Used for filtering by category (Home Page)
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
-- Used for filtering by user (My Page)
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);

-- 2. Likes Indexes
-- Used for counting likes and checking status
CREATE INDEX IF NOT EXISTS idx_likes_recipe_id ON likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- 3. Collections Indexes
-- Used for finding user's collections
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);

-- 4. Collection Items Indexes
-- Used for fetching items in a collection (Collection Detail)
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
-- Used for finding if a recipe is in any collection (Modal check)
CREATE INDEX IF NOT EXISTS idx_collection_items_recipe_id ON collection_items(recipe_id);

-- 5. Profiles Indexes
-- Used for joining profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
