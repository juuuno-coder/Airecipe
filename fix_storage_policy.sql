-- 기존 정책 충돌 방지를 위해 관련 정책 삭제
DROP POLICY IF EXISTS "Public Access Recipe Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Upload Recipe Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Upload Avatars" ON storage.objects;

-- [recipe-images] 버킷 생성 (없을 경우)
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- [avatars] 버킷 생성 (없을 경우)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- [recipe-images] 정책: 누구나 조회/업로드/수정 가능 (개발용)
CREATE POLICY "Give Me Access To Recipe Images Select" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');
CREATE POLICY "Give Me Access To Recipe Images Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-images');
CREATE POLICY "Give Me Access To Recipe Images Update" ON storage.objects FOR UPDATE USING (bucket_id = 'recipe-images');

-- [avatars] 정책: 누구나 조회/업로드/수정 가능 (개발용)
CREATE POLICY "Give Me Access To Avatars Select" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Give Me Access To Avatars Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Give Me Access To Avatars Update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
