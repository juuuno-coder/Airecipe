-- Profiles 테이블의 username을 Auth 계정의 실제 이메일 앞부분(ID)로 강제 동기화합니다.
-- "Editor"나 "익명"으로 잘못 들어가 있는 데이터를 고치는 것이 핵심입니다.

UPDATE public.profiles
SET username = split_part(auth.users.email, '@', 1)
FROM auth.users
WHERE public.profiles.id = auth.users.id
  AND auth.users.email = 'juuuno@naver.com';  -- 특정 사용자만 타겟팅 (안전장치)

-- 확인용 출력 (Optional)
-- select * from profiles where id = (select id from auth.users where email = 'juuuno@naver.com');
