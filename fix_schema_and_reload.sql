-- 1. 안전 장치: recipes 테이블에 user_id가 정말 없다면 추가
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'recipes' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE recipes ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. PostgREST 스키마 캐시 강제 새로고침
-- Supabase가 DB 변경사항을 즉시 인식하지 못할 때 사용합니다.
NOTIFY pgrst, 'reload config';
