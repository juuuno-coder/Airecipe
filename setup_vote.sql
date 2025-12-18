-- 1. Weekly Votes Table
create table if not exists public.weekly_votes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  unique(user_id, recipe_id)
);

alter table public.weekly_votes enable row level security;

create policy "Votes are viewable by everyone" 
on public.weekly_votes for select 
using (true);

create policy "Users can insert their own vote" 
on public.weekly_votes for insert 
with check (auth.uid() = user_id);

create policy "Users can delete their own vote" 
on public.weekly_votes for delete 
using (auth.uid() = user_id);


-- 2. Weekly Rankings View (View Counts + Likes + Votes)
-- Score Rule: Like = 1pt, Vote = 3pts (Last 7 days data only)
create or replace view public.weekly_rankings_view as
select
  r.id as recipe_id,
  r.title,
  r.image_url,
  p.username,
  p.avatar_url,
  coalesce(
    (select count(*) from public.likes l 
     where l.recipe_id = r.id 
     and l.created_at >= (now() - interval '7 days')
    ) * 1 
    +
    (select count(*) from public.weekly_votes v 
     where v.recipe_id = r.id 
     and v.created_at >= (now() - interval '7 days')
    ) * 3, 
  0) as score,
  (select count(*) from public.likes l 
   where l.recipe_id = r.id and l.created_at >= (now() - interval '7 days')
  ) as weekly_likes,
  (select count(*) from public.weekly_votes v 
   where v.recipe_id = r.id and v.created_at >= (now() - interval '7 days')
  ) as weekly_votes
from public.recipes r
left join public.profiles p on r.user_id = p.id
order by score desc;
