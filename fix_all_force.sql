-- [Emergency Fix - Force Reset Policies]
-- This script forcefully resets RLS policies for Likes, Collections, and Profiles.
-- It fixes permission denied errors.

-- 1. LIKES: Reset Policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
DROP POLICY IF EXISTS "Enable read access for all users" ON likes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON likes;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON likes;

CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- 2. COLLECTIONS: Reset Policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own collections" ON collections;
DROP POLICY IF EXISTS "Users can create their own collections" ON collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON collections;

CREATE POLICY "Users can view their own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

-- 3. COLLECTION ITEMS: Reset Policies
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view items in their collections" ON collection_items;
DROP POLICY IF EXISTS "Users can add items to their collections" ON collection_items;
DROP POLICY IF EXISTS "Users can remove items from their collections" ON collection_items;

CREATE POLICY "Users can view items in their collections" ON collection_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
);
CREATE POLICY "Users can add items to their collections" ON collection_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
);
CREATE POLICY "Users can remove items from their collections" ON collection_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
);

-- 4. PROFILES: Ensure public access
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

-- 5. Grant Permissions (Just in case)
GRANT ALL ON TABLE likes TO authenticated;
GRANT ALL ON TABLE likes TO service_role;
GRANT ALL ON TABLE collections TO authenticated;
GRANT ALL ON TABLE collections TO service_role;
GRANT ALL ON TABLE collection_items TO authenticated;
GRANT ALL ON TABLE collection_items TO service_role;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT ALL ON TABLE profiles TO service_role;
GRANT ALL ON TABLE profiles TO anon;
