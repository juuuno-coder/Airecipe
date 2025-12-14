-- [Fix Recipes] Ensure Recipes are Publicly Readable
-- Required for Collections to show saved recipes from other users.

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read recipes
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;
DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON recipes;
DROP POLICY IF EXISTS "Users can view their own recipes" ON recipes; -- Remove strict policy if exists

CREATE POLICY "Recipes are viewable by everyone" ON recipes FOR SELECT USING (true);

-- Ensure Write policies exist (Owner only)
-- (Assuming standard policies, but re-stating for safety)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own recipes') THEN
        CREATE POLICY "Users can insert their own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own recipes') THEN
        CREATE POLICY "Users can update their own recipes" ON recipes FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own recipes') THEN
        CREATE POLICY "Users can delete their own recipes" ON recipes FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
