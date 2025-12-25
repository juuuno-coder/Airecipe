-- 1. Recipes Table Policies
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Drop existing restricted policies to be safe
DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON recipes;
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;

-- Create a blanket "Read All" policy for recipes
-- This ensures ANYONE (logged in or not) can see the recipe detail page
CREATE POLICY "Recipes are viewable by everyone"
ON recipes FOR SELECT
USING (true);

-- 2. Profiles Table Policies (Just in case join fails)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create a blanket "Read All" policy for profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);
