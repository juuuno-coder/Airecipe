-- 1. Ensure Hall of Fame table exists with proper structure
create table if not exists public.hall_of_fame (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  week_start_date date not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  rank integer not null check (rank between 1 and 3),
  
  -- Snapshot of stats at the time of induction
  fixed_score integer not null default 0,
  fixed_likes integer not null default 0,
  fixed_votes integer not null default 0,

  unique(week_start_date, rank) -- One rank per week
);

alter table public.hall_of_fame enable row level security;
create policy "Hall of Fame viewable by everyone" on public.hall_of_fame for select using (true);


-- 2. Create the Induction Function (To be called manually or by cron)
create or replace function public.induct_weekly_winners()
returns void
language plpgsql
security definer
as $$
declare
  week_start date;
  r record;
  current_rank integer := 1;
begin
  -- Identify the start of the week (e.g., Last Monday or just Today if running exactly at 00:00)
  -- If we run this on Sunday midnight (start of new week), we want to induct winners for the *past* week.
  week_start := (current_date - interval '7 days')::date;

  -- Remove existing entries for this week if any (to allow re-runs)
  delete from public.hall_of_fame where week_start_date = week_start;

  -- Loop through top 3 and insert
  for r in (
    select * from public.weekly_rankings_view
    limit 3
  ) loop
    insert into public.hall_of_fame (
      week_start_date,
      recipe_id,
      rank,
      fixed_score,
      fixed_likes,
      fixed_votes
    ) values (
      week_start,
      r.recipe_id,
      current_rank,
      r.score,
      r.weekly_likes,
      r.weekly_votes
    );
    current_rank := current_rank + 1;
  end loop;
end;
$$;


-- 3. Enable pg_cron and Schedule (Requires superuser/postgres role)
-- Note: If this fails, enable pg_cron extension from Supabase Dashboard > Database > Extensions first.
create extension if not exists pg_cron;

-- Schedule: Every Sunday at 00:00 UTC (Adjust time zone if needed)
-- '0 0 * * 0' = Minute 0, Hour 0, Every Day, Every Month, Sunday
select cron.schedule(
  'weekly-hall-of-fame-induction', -- Job name
  '0 0 * * 0',                     -- Schedule
  $$select public.induct_weekly_winners()$$
);

-- Check scheduled jobs
select * from cron.job;
