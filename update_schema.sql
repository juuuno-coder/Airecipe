-- 1. Recipes 테이블 확장
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Likes (좋아요) 테이블 생성
CREATE TABLE IF NOT EXISTS likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);

-- Likes 테이블 RLS 설정
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (에러 방지용)
DROP POLICY IF EXISTS "Public Access Likes Select" ON likes;
DROP POLICY IF EXISTS "Auth Users Insert Likes" ON likes;
DROP POLICY IF EXISTS "Auth Users Delete Likes" ON likes;

-- 정책 재생성
CREATE POLICY "Public Access Likes Select" ON likes FOR SELECT USING (true);
CREATE POLICY "Auth Users Insert Likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth Users Delete Likes" ON likes FOR DELETE USING (auth.uid() = user_id);


-- 3. Comments (댓글) 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments 테이블 RLS 설정
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (에러 방지용)
DROP POLICY IF EXISTS "Public Access Comments Select" ON comments;
DROP POLICY IF EXISTS "Auth Users Insert Comments" ON comments;
DROP POLICY IF EXISTS "Auth Users Update Comments" ON comments;
DROP POLICY IF EXISTS "Auth Users Delete Comments" ON comments;

-- 정책 재생성
CREATE POLICY "Public Access Comments Select" ON comments FOR SELECT USING (true);
CREATE POLICY "Auth Users Insert Comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth Users Update Comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth Users Delete Comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- 4. 조회수 증가 함수 (이미 있으면 업데이트)
CREATE OR REPLACE FUNCTION increment_view_count(p_recipe_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE recipes
  SET view_count = view_count + 1
  WHERE id = p_recipe_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
