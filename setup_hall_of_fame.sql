-- Create Hall of Fame table
create table if not exists public.hall_of_fame (
    id uuid not null default gen_random_uuid() primary key,
    recipe_id uuid references public.recipes(id) on delete cascade not null,
    induction_date date not null default current_date, -- The date it was famous or inducted
    award_title text default 'Weekly Best', -- Title like "1st Place", "Legendary"
    created_at timestamptz default now() not null,
    unique(recipe_id) -- A recipe is in the HoF only once
);

-- Enable RLS
alter table public.hall_of_fame enable row level security;

-- Policies
-- Only specific users should ideally insert, but for this MVP allow auth users (assuming user is admin/owner)
create policy "Users can view hall of fame" on public.hall_of_fame for select using (true);
create policy "Users can induct recipes" on public.hall_of_fame for insert with check (auth.role() = 'authenticated');
create policy "Users can remove from hall of fame" on public.hall_of_fame for delete using (auth.role() = 'authenticated');

-- Notify for schema reload
NOTIFY pgrst, 'reload config';
