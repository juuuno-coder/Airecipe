-- Ensure all recipes refer to valid profiles, or set user_id to null (or delete them)
-- Here, we'll try to create profiles for missing users if they exist in auth.users
-- Or default to just cleaning up bad references if necessary.

-- But typically, recipes.user_id references auth.users.id.
-- profiles.id also references auth.users.id.
-- So they share the same ID space.

-- If a recipe has a user_id that is NOT in profiles, insert a placeholder profile
INSERT INTO profiles (id, username, email, avatar_url)
SELECT DISTINCT r.user_id, 'Unknown Chef', 'unknown@example.com', ''
FROM recipes r
WHERE r.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = r.user_id)
  -- Only if the user actually exists in auth.users (to satisfy FK)
  AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = r.user_id);

-- If user doesn't exist in auth.users either, we might want to nullify recipe.user_id
-- UPDATE recipes SET user_id = NULL
-- WHERE user_id IS NOT NULL 
--   AND NOT EXISTS (SELECT 1 FROM auth.users WHERE id = recipes.user_id);
