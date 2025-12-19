-- 1. [중요] 나 자신을 확실하게 관리자(admin)로 설정
-- 스크린샷에 보이는 이메일 기준으로 설정합니다. 필요하면 이메일을 수정하세요.
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email like 'duscontactus%' limit 1
);

-- 2. 관리자는 모든 유저 프로필을 볼 수 있는 권한 추가
create policy "Admins can view all profiles"
on public.profiles for select
using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- 3. 관리자는 유저 정보를 수정(권한 변경 등)할 수 있는 권한 추가
create policy "Admins can update user roles"
on public.profiles for update
using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- 4. 혹시 모르니 일반 공개 정책 (이미 있을 수 있음)
-- 아이디/닉네임/아바타는 원래 누구나 볼 수 있어야 함 (ViewCounter 등에서 사용)
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (true);
