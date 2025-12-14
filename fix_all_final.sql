-- [FINAL FIX - ALL IN ONE]
-- This script fixes invisible items in Collections, Main Page, and Likes.
-- It ensures ALL read permissions are Public.

-- 1. RECIPES: Public Read
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;
CREATE POLICY "Recipes are viewable by everyone" ON recipes FOR SELECT USING (true);


-- 2. COLLECTIONS: Public Read
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;
DROP POLICY IF EXISTS "Users can view their own collections" ON collections;
CREATE POLICY "Collections are viewable by everyone" ON collections FOR SELECT USING (true);


-- 3. COLLECTION ITEMS: Public Read
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Collection items are viewable by everyone" ON collection_items;
DROP POLICY IF EXISTS "Users can view items in their collections" ON collection_items;
CREATE POLICY "Collection items are viewable by everyone" ON collection_items FOR SELECT USING (true);


-- 4. LIKES: Public Read
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON likes;
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);


-- 5. PROFILES: Public Read
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);


-- 6. Grant Permissions (For good measure)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;
