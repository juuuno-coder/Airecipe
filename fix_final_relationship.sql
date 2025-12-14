-- 1. 기존의 제약 조건이 있다면 삭제 (이름 추측하여 삭제 시도)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'recipes_user_id_fkey') THEN 
        ALTER TABLE recipes DROP CONSTRAINT recipes_user_id_fkey; 
    END IF;
END $$;

-- 2. recipes 테이블의 user_id가 profiles 테이블의 id를 직접 참조하도록 설정
-- 이렇게 해야 supabase 클라이언트에서 .select('*, profiles(*)') 할 때 연결됨
ALTER TABLE recipes
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 3. 확실한 적용을 위해 스키마 캐시 리로드 알림 (Supabase 내부용)
NOTIFY pgrst, 'reload schema';
