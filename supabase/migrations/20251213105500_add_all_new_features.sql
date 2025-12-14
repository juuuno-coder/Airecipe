-- 1. Recipe Comparisons: Add columns safely
alter table public.recipes 
add column if not exists before_image_url text,
add column if not exists after_image_url text,
add column if not exists tags text[];

-- 2. Notifications System
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

create policy "Users can view their own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- Triggers (Safe creation)
create or replace function public.handle_new_like() returns trigger as $$
begin
  if new.user_id != (select user_id from public.recipes where id = new.recipe_id) then
    insert into public.notifications (user_id, actor_id, type, recipe_id, message)
    values ((select user_id from public.recipes where id = new.recipe_id), new.user_id, 'like', new.recipe_id, '누군가 회원님의 레시피를 좋아합니다.');
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_new_like on public.likes;
create trigger on_new_like after insert on public.likes for each row execute function public.handle_new_like();


-- 3. Collections System
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

create policy "Users can view public collections" on public.collections for select using (is_public = true or auth.uid() = user_id);
create policy "Users can manage their own collections" on public.collections for all using (auth.uid() = user_id);

create policy "Users can view items in public collections" on public.collection_items for select using ( exists ( select 1 from public.collections where collections.id = collection_items.collection_id and (collections.is_public = true or collections.user_id = auth.uid()) ) );
create policy "Users can manage items in their own collections" on public.collection_items for all using ( exists ( select 1 from public.collections where collections.id = collection_items.collection_id and collections.user_id = auth.uid() ) );
