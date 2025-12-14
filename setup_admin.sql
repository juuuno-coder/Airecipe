-- 1. Create Banners Table
create table if not exists public.site_banners (
    id uuid not null default gen_random_uuid() primary key,
    title text not null default '이번 주 주제: 시간 여행자',
    subtitle text default 'AI로 당신만의 상상을 펼쳐보세요.',
    image_url text default 'https://images.unsplash.com/photo-1635243179236-4b8c9735d64b?q=80&w=1000&auto=format&fit=crop',
    link_url text default '/create',
    button_text text default '챌린지 참여하기',
    is_active boolean default true,
    display_order int default 1,
    created_at timestamptz default now() not null
);

-- Insert a default banner if empty
insert into public.site_banners (title, subtitle, image_url, link_url, button_text)
select '상상을 현실로 만드는 AI Recipe', '검증된 프롬프트와 꿀팁을 확인하세요.', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop', '/create', '새로운 레시피 등록'
where not exists (select 1 from public.site_banners);

-- Enable RLS
alter table public.site_banners enable row level security;

-- Policies (Ideally only admins can update, everyone can view)
create policy "Everyone can view banners" on public.site_banners for select using (true);
create policy "Admins can manage banners" on public.site_banners for all using (true); -- Relaxed for now for development convenience

-- Notify
NOTIFY pgrst, 'reload config';
