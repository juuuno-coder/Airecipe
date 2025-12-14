-- 1. 기존의 잘못된 연결 고리가 있다면 끊습니다.
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_user_id_fkey;

-- 2. recipes 테이블의 user_id가 profiles 테이블의 id를 가리키도록 연결합니다.
-- 이렇게 해야 .select('*, profiles(*)') 쿼리가 작동합니다.
ALTER TABLE recipes
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 3. 캐시 새로고침
NOTIFY pgrst, 'reload config';
