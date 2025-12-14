-- [Fix RLS] Allow public read access to Collections and Items
-- This solves the issue where items are not visible in the detail page due to strict RLS.

-- 1. COLLECTIONS: Allow public SELECT
DROP POLICY IF EXISTS "Users can view their own collections" ON collections;
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;
CREATE POLICY "Collections are viewable by everyone" ON collections FOR SELECT USING (true);

-- 2. COLLECTION ITEMS: Allow public SELECT
DROP POLICY IF EXISTS "Users can view items in their collections" ON collection_items;
DROP POLICY IF EXISTS "Collection items are viewable by everyone" ON collection_items;
CREATE POLICY "Collection items are viewable by everyone" ON collection_items FOR SELECT USING (true);

-- Ensure Insert/Delete/Update policies remain restrictive (Owner only) is handled by previous setup or defaults to Deny.
-- We re-apply Owner Write policies just in case they were dropped improperly before.

DO $$
BEGIN
    -- Collections Write
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own collections') THEN
        CREATE POLICY "Users can create their own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own collections') THEN
        CREATE POLICY "Users can delete their own collections" ON collections FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- Collection Items Write (Complex check remains for write safety)
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
