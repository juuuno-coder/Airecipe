-- 1. Profiles Table & Trigger
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  email text,
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for Auto-Profile Creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Recipes Table
create table if not exists public.recipes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  cooking_time_minutes integer,
  category text,
  difficulty text,
  ingredients jsonb default '[]'::jsonb,
  instructions jsonb default '[]'::jsonb,
  user_id uuid references auth.users not null,
  view_count integer default 0,
  before_image_url text,
  after_image_url text,
  is_anonymous boolean default false,
  origin_prompt text
);

alter table public.recipes enable row level security;

create policy "Recipes are viewable by everyone." on recipes for select using (true);
create policy "Users can insert their own recipe." on recipes for insert with check (auth.uid() = user_id);
create policy "Users can update own recipe." on recipes for update using (auth.uid() = user_id);
create policy "Users can delete own recipe." on recipes for delete using (auth.uid() = user_id);


-- 3. Likes Table
create table if not exists public.likes (
    id uuid default gen_random_uuid() primary key, -- Add ID for easier management
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users not null,
    recipe_id uuid references public.recipes(id) on delete cascade not null,
    unique(user_id, recipe_id) -- Prevent duplicate likes
);

alter table public.likes enable row level security;
create policy "Likes are viewable by everyone" on likes for select using (true);
create policy "Users can insert their own likes" on likes for insert with check (auth.uid() = user_id);
create policy "Users can delete their own likes" on likes for delete using (auth.uid() = user_id);


-- 4. RPC: Increment View Count
create or replace function increment_view_count(p_recipe_id uuid)
returns void as $$
begin
  update public.recipes
  set view_count = view_count + 1
  where id = p_recipe_id;
end;
$$ language plpgsql security definer;


-- 5. Storage Buckets (If permissions allow via SQL)
insert into storage.buckets (id, name, public) 
values ('recipes', 'recipes', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'recipes' );
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'recipes' and auth.role() = 'authenticated' );
