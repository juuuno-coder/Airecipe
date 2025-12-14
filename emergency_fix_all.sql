-- 1. [정책 초기화] 꼬인 권한을 싹 풀어서 누구나 볼 수 있게 합니다.
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (충돌 방지)
DROP POLICY IF EXISTS "Public Access Recipes Select" ON recipes;
DROP POLICY IF EXISTS "Auth Users Insert Recipes" ON recipes;
DROP POLICY IF EXISTS "Auth Users Update Recipes" ON recipes;
DROP POLICY IF EXISTS "Auth Users Delete Recipes" ON recipes;

-- 새 정책 적용
CREATE POLICY "Public Access Recipes Select" ON recipes FOR SELECT USING (true); -- 누구나 조회
CREATE POLICY "Auth Users Insert Recipes" ON recipes FOR INSERT WITH CHECK (auth.role() = 'authenticated'); -- 로그인 시 작성
CREATE POLICY "Auth Users Update Recipes" ON recipes FOR UPDATE USING (auth.uid() = user_id); -- 본인만 수정
CREATE POLICY "Auth Users Delete Recipes" ON recipes FOR DELETE USING (auth.uid() = user_id); -- 본인만 삭제


-- 2. [데이터 연결] 주인 없는 레시피들을 'juuuno@naver.com' 님의 것으로 만듭니다.
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- juuuuno@naver.com 유저의 ID를 찾습니다.
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'juuuno@naver.com' LIMIT 1;

    IF target_user_id IS NOT NULL THEN
        -- user_id가 비어있는 레시피들의 주인을 이 유저로 설정합니다.
        UPDATE recipes
        SET user_id = target_user_id
        WHERE user_id IS NULL;
        
        RAISE NOTICE '레시피 소유권 복구 완료: %', target_user_id;
    END IF;
END $$;
