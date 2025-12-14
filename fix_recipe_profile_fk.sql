-- 1. Fix Data Integrity
-- Insert placeholder profiles for existing users who don't have a profile yet
INSERT INTO profiles (id, username, email, avatar_url)
SELECT DISTINCT r.user_id, 'Unknown Chef', 'unknown@example.com', ''
FROM recipes r
WHERE r.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = r.user_id)
  AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = r.user_id);

-- 2. Add explicit Foreign Key from recipes.user_id to profiles.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'recipes_user_id_profiles_fkey' 
        AND table_name = 'recipes'
    ) THEN
        ALTER TABLE recipes
        ADD CONSTRAINT recipes_user_id_profiles_fkey
        FOREIGN KEY (user_id)
        REFERENCES profiles (id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Ensure RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);
