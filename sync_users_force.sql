-- 1. 숨어있는 유저들을 profiles 테이블로 강제 복사 (Sync)
insert into public.profiles (id, email, username, created_at, role)
select 
  id, 
  email, 
  -- 이름이 없으면 이메일 앞부분을 닉네임으로 사용
  coalesce(
    raw_user_meta_data->>'full_name', 
    substring(email from 1 for position('@' in email) - 1), 
    'User-' || substring(id::text from 1 for 4)
  ) as username,
  created_at,
  -- 관리자 이메일 확인해서 role 지정, 나머지는 user
  case 
     when email like 'duscontactus%' then 'admin' 
     else 'user' 
  end as role
from auth.users
on conflict (id) do update
set email = excluded.email; -- 이미 존재하면 이메일만 최신으로 갱신

-- 2. 결과 확인용 쿼리 (실행 후 'Results' 탭을 보세요!)
select 
  count(*) as "현재_프로필_총_개수", 
  '이제_관리자_페이지에서_새로고침하세요' as "메시지" 
from public.profiles;
