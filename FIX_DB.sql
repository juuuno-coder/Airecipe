-- 1. Fix Missing Recipe Columns
alter table public.recipes 
add column if not exists before_image_url text, -- 원본 이미지
add column if not exists after_image_url text,  -- 결과 이미지
add column if not exists tags text[];           -- 태그

-- 2. Force Refresh PostgREST Schema Cache (Critical Error Fix)
NOTIFY pgrst, 'reload config';

-- 3. Ensure Notifications Table Exists
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  actor_id uuid references public.profiles(id),
  type text check (type in ('like', 'comment', 'remix', 'follow')) not null,
  recipe_id uuid references public.recipes(id),
  message text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Notifications
alter table public.notifications enable row level security;
drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);

-- 4. Ensure Collections Table Exists
create table if not exists public.collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  is_public boolean default true,
  color text default 'bg-indigo-500',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.collection_items (
  id uuid default gen_random_uuid() primary key,
  collection_id uuid references public.collections(id) on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(collection_id, recipe_id)
);

-- RLS for Collections
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;

drop policy if exists "Users can view public collections" on public.collections;
create policy "Users can view public collections" on public.collections for select using (is_public = true or auth.uid() = user_id);
drop policy if exists "Users can manage their own collections" on public.collections;
create policy "Users can manage their own collections" on public.collections for all using (auth.uid() = user_id);

-- 5. Final Cache Refresh just in case
NOTIFY pgrst, 'reload config';
