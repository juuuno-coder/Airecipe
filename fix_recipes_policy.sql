-- 1. Recipes 테이블의 기존 정책을 싹 정리합니다 (충돌 방지)
DROP POLICY IF EXISTS "Enable read access for all users" ON recipes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON recipes;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON recipes;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON recipes;
-- 기존 정책 이름이 다를 수도 있으니 일반적인 이름들도 삭제 시도
DROP POLICY IF EXISTS "Public Access Recipes Select" ON recipes;
DROP POLICY IF EXISTS "Auth Users Insert Recipes" ON recipes;
DROP POLICY IF EXISTS "Auth Users Update Recipes" ON recipes;
DROP POLICY IF EXISTS "Auth Users Delete Recipes" ON recipes;


-- 2. RLS(행 수준 보안)를 확실하게 켭니다
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;


-- 3. [핵심] 조회(SELECT): 누구나 레시피를 볼 수 있습니다.
CREATE POLICY "Public Access Recipes Select"
ON recipes FOR SELECT
USING (true);

-- 4. 작성(INSERT): 로그인한 사람만 쓸 수 있습니다.
CREATE POLICY "Auth Users Insert Recipes"
ON recipes FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 5. 수정(UPDATE): 본인(user_id가 내 아이디인 경우)만 수정 가능합니다.
CREATE POLICY "Auth Users Update Recipes"
ON recipes FOR UPDATE
USING (auth.uid() = user_id);

-- 6. 삭제(DELETE): 본인만 삭제 가능합니다.
CREATE POLICY "Auth Users Delete Recipes"
ON recipes FOR DELETE
USING (auth.uid() = user_id);
