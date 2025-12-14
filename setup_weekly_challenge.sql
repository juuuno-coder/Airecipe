-- 1. Create table for "Super Votes" (강력 추천)
create table if not exists public.weekly_votes (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    recipe_id uuid references public.recipes(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    unique(user_id, recipe_id) -- User can vote only once per recipe (forever? or reset weekly? Let's keep it simple: once per recipe, but we filter by date for ranking)
);

-- Enable RLS
alter table public.weekly_votes enable row level security;

-- Policies
create policy "Users can vote" on public.weekly_votes for insert with check (auth.uid() = user_id);
create policy "Users can remove vote" on public.weekly_votes for delete using (auth.uid() = user_id);
create policy "Everyone can see votes" on public.weekly_votes for select using (true);


-- 2. Create a View for Weekly Ranking Calculation
-- This view accepts dynamic calculation based on current week
create or replace view public.weekly_rankings_view as
with current_week as (
    -- Start of the current week (Monday)
    select date_trunc('week', now()) as start_date
),
w_likes as (
    select recipe_id, count(*) as cnt 
    from likes 
    where created_at >= (select start_date from current_week)
    group by recipe_id
),
w_votes as (
    select recipe_id, count(*) as cnt 
    from weekly_votes 
    where created_at >= (select start_date from current_week)
    group by recipe_id
)
-- Note: Assuming 'collections' table exists. If not, this part will fail. 
-- Just in case collections table name differs or doesn't track created_at efficiently, 
-- I will omit collections distinct count for this MVP View to ensure safety, 
-- OR assuming standard simple schema. Let's include it but be careful.
-- actually, let's stick to Likes(1) + Votes(3) for stability first, as I can't verifying collections schema right now.
select 
    r.id as recipe_id,
    r.title,
    r.image_url,
    r.user_id,
    p.username,
    p.avatar_url,
    -- Score Calculation: Like(1) + Vote(3)
    (coalesce(wl.cnt, 0) * 1) + (coalesce(wv.cnt, 0) * 3) as score,
    coalesce(wl.cnt, 0) as weekly_likes,
    coalesce(wv.cnt, 0) as weekly_votes
from recipes r
left join profiles p on r.user_id = p.id
left join w_likes wl on r.id = wl.recipe_id
left join w_votes wv on r.id = wv.recipe_id
where (coalesce(wl.cnt, 0) * 1) + (coalesce(wv.cnt, 0) * 3) > 0 -- Only show ranked items
order by score desc;

-- Force schema reload
NOTIFY pgrst, 'reload config';
