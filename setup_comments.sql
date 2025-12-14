-- 1. Comments 테이블 생성 (없으면 생성)
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL
);

-- 2. RLS(Row Level Security) 활성화
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 3. 정책 초기화 (기존 정책이 있다면 삭제하여 충돌 방지)
DROP POLICY IF EXISTS "Public Access Comments Select" ON comments;
DROP POLICY IF EXISTS "Auth Users Insert Comments" ON comments;
DROP POLICY IF EXISTS "Users Delete Own Comments" ON comments;

-- 4. 정책 설정
-- 읽기: 누구나 가능
CREATE POLICY "Public Access Comments Select" ON comments 
    FOR SELECT USING (true);

-- 쓰기: 로그인한 사용자만 가능 (내 아이디로)
CREATE POLICY "Auth Users Insert Comments" ON comments 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 삭제: 본인이 쓴 댓글만 삭제 가능
CREATE POLICY "Users Delete Own Comments" ON comments 
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Foreign Key 관계 재설정 (조회를 위해 profiles 테이블과 명시적 연결)
-- 기존 제약조건이 있다면 삭제
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;

-- auth.users 대신 profiles.id를 참조하도록 설정 (PostgREST 조인을 위해)
-- profiles.id는 auth.users.id와 1:1 매핑되므로 안전함
ALTER TABLE comments
    ADD CONSTRAINT comments_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- 6. 스키마 캐시 리로드 (Supabase가 변경사항을 즉시 인식하도록)
NOTIFY pgrst, 'reload config';
