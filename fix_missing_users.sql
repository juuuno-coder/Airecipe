-- 1. [핵심] 기존에 가입했지만 profiles에 없는 유저들을 강제로 가져오기
insert into public.profiles (id, email, username, created_at, role)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'full_name', substring(email from 1 for position('@' in email) - 1)) as username,
  created_at,
  'user' -- 일단 기본 유저로 넣기
from auth.users
on conflict (id) do nothing;

-- 2. [자동화] 앞으로 가입할 때 자동으로 profiles에도 넣는 함수 만들기
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', substring(new.email from 1 for position('@' in new.email) - 1)),
    'user'
  );
  return new;
end;
$$;

-- 3. [트리거 장착] 위 함수를 회원가입 이벤트에 연결 (이미 있으면 삭제 후 재생성)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. [관리자 지정] 다시 한번 내 계정을 관리자로 승격 (이메일 확인!)
update public.profiles
set role = 'admin'
where email like 'duscontactus%';
