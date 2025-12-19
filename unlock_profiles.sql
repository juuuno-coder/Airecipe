-- 1. 기존의 깐깐한 조회 규칙들을 모두 삭제합니다.
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Enable read access for all users" on public.profiles;
drop policy if exists "Allow Select for All" on public.profiles;

-- 2. "누구나 프로필 정보를 읽을 수 있다"는 규칙을 새로 만듭니다.
-- 이렇게 해야 관리자 페이지에서 유저 목록을 불러올 때 막히지 않습니다.
create policy "Allow Select for All" 
on public.profiles for select 
using (true);
