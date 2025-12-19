-- 1. 사이트 설정 테이블 (단일 행만 존재)
create table if not exists public.site_settings (
  id int primary key default 1,
  announcement_text text,
  is_announcement_visible boolean default false,
  maintenance_mode boolean default false,
  banned_keywords text[] default '{}',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- 2. 초기 데이터 삽입
insert into public.site_settings (id, announcement_text, is_announcement_visible)
values (1, '🚀 AI Recipe 사이트가 오픈했습니다!', true)
on conflict (id) do nothing;

-- 3. 권한 설정 (RLS)
alter table public.site_settings enable row level security;

-- 누구나 설정 읽기 가능 (공지사항 표시 위해)
create policy "Everyone can view settings" 
on public.site_settings for select 
using (true);

-- 관리자만 수정 가능
create policy "Admins can update settings" 
on public.site_settings for update 
using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  )
);
