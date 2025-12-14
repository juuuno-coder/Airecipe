-- 1. RLS 해제 (가장 강력한 해결책)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;

-- 2. FK 재설정
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_user_id_fkey;
ALTER TABLE recipes
  ADD CONSTRAINT recipes_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id)
  ON DELETE CASCADE;

-- 3. 정책 충돌 방지를 위해 기존 정책 삭제 후 재생성 (만약 RLS를 켤 경우를 대비)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );
