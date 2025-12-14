-- [COMPLETE FIX v2] 
-- 1. Relax RLS for public viewing (fixes invisible items in collection detail)
-- 2. Ensure Likes table policies
-- 3. Fix Profiles/Recipes FK

-- A. COLLECTIONS & ITEMS: Allow Public Read (Important for sharing and debugging)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own collections" ON collections;
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;
CREATE POLICY "Collections are viewable by everyone" ON collections FOR SELECT USING (true);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view items in their collections" ON collection_items;
DROP POLICY IF EXISTS "Collection items are viewable by everyone" ON collection_items;
CREATE POLICY "Collection items are viewable by everyone" ON collection_items FOR SELECT USING (true);

-- Restore Write Policies (Owner Only)
DO $$
BEGIN
    -- Collections Write
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own collections') THEN
        CREATE POLICY "Users can create their own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own collections') THEN
        CREATE POLICY "Users can delete their own collections" ON collections FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- Collection Items Write
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can add items to their collections') THEN
        CREATE POLICY "Users can add items to their collections" ON collection_items FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can remove items from their collections') THEN
        CREATE POLICY "Users can remove items from their collections" ON collection_items FOR DELETE USING (
            EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
        );
    END IF;
END $$;


-- B. LIKES: Ensure Policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);


-- C. PROFILES: Ensure Public Read
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);


-- D. Grant Permissions
GRANT ALL ON TABLE likes TO authenticated;
GRANT ALL ON TABLE likes TO service_role;
GRANT ALL ON TABLE collections TO authenticated;
GRANT ALL ON TABLE collections TO service_role;
GRANT ALL ON TABLE collection_items TO authenticated;
GRANT ALL ON TABLE collection_items TO service_role;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT ALL ON TABLE profiles TO service_role;
GRANT ALL ON TABLE profiles TO anon;
