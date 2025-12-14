-- 1. 레시피 이미지용 버킷 생성 (이미 존재하면 에러가 날 수 있으나 무시해도 됨)
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 아바타 이미지용 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;


-- 3. [recipe-images] 정책 설정: 누구나 조회 가능
CREATE POLICY "Public Access Recipe Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'recipe-images' );

-- 4. [recipe-images] 정책 설정: 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated Users Upload Recipe Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'recipe-images' AND auth.role() = 'authenticated' );


-- 5. [avatars] 정책 설정: 누구나 조회 가능
CREATE POLICY "Public Access Avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 6. [avatars] 정책 설정: 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated Users Upload Avatars"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
