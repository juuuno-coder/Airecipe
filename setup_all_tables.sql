-- [Integrated Setup Script v3 - Complete Edition]
-- SETUP: Profiles, Collections, Likes, and FKs.
-- Run this single script to fix ALL database issues.

-- ==========================================
-- 1. PROFILES & RECIPES
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

DO $$
BEGIN
    -- Safely add missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE profiles ADD COLUMN email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE profiles ADD COLUMN username TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Fix missing profiles
INSERT INTO profiles (id, username, email, avatar_url)
SELECT DISTINCT r.user_id, 'Unknown Chef', 'unknown@example.com', ''
FROM recipes r
WHERE r.user_id IS NOT NULL 
  AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = r.user_id)
ON CONFLICT (id) DO NOTHING;

-- Fix FK Recipes -> Profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'recipes_user_id_profiles_fk' AND table_name = 'recipes') THEN
        ALTER TABLE recipes ADD CONSTRAINT recipes_user_id_profiles_fk FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ==========================================
-- 2. COLLECTIONS (FOLDERS)
-- ==========================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (collection_id, recipe_id)
);

-- ==========================================
-- 3. LIKES
-- ==========================================
CREATE TABLE IF NOT EXISTS likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, recipe_id)
);

-- ==========================================
-- 4. SECURITY (RLS)
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- PROFILES
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone') THEN
        CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- COLLECTIONS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own collections') THEN
        CREATE POLICY "Users can view their own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own collections') THEN
        CREATE POLICY "Users can create their own collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own collections') THEN
        CREATE POLICY "Users can delete their own collections" ON collections FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- COLLECTION ITEMS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view items in their collections') THEN
        CREATE POLICY "Users can view items in their collections" ON collection_items FOR SELECT USING (
            EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_items.collection_id AND collections.user_id = auth.uid())
        );
    END IF;
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

    -- LIKES
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Likes are viewable by everyone') THEN
        CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own likes') THEN
        CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own likes') THEN
        CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
