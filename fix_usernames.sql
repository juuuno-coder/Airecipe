-- 1. 프로필 테이블(profiles)의 username이 비어있는 경우, 
-- auth.users 테이블의 이메일 앞부분(@ 앞)을 가져와서 채워넣습니다.

UPDATE public.profiles
SET username = split_part(users.email, '@', 1)
FROM auth.users
WHERE public.profiles.id = auth.users.id
  AND (public.profiles.username IS NULL OR public.profiles.username = '' OR public.profiles.username = '익명');

-- 실행 후 적용되었는지 확인하는 쿼리 (선택사항)
-- SELECT * FROM public.profiles;
