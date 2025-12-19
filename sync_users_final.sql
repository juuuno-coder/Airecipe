-- 1. [해결] profiles 테이블에 없다면 created_at 컬럼 추가
alter table public.profiles 
add column if not exists created_at timestamptz default now();

-- 2. 숨어있는 유저들을 profiles 테이블로 강제 복사 (Sync)
insert into public.profiles (id, email, username, created_at, role)
select 
  id, 
  email, 
  coalesce(
    raw_user_meta_data->>'full_name', 
    substring(email from 1 for position('@' in email) - 1), 
    'User-' || substring(id::text from 1 for 4)
  ) as username,
  created_at, -- 이제 컬럼이 있어서 에러가 안 납니다!
  case 
     when email like 'duscontactus%' then 'admin' 
     else 'user' 
  end as role
from auth.users
on conflict (id) do update
set 
  email = excluded.email,
  created_at = excluded.created_at; -- 기존 유저도 가입일 업데이트

-- 3. 결과 확인 (숫자가 나와야 성공!)
select 
  count(*) as "복구된_유저_수", 
  '성공' as "상태" 
from public.profiles;
