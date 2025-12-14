-- Add category column to recipes table
alter table public.recipes 
add column if not exists category text default '기타';

-- Update existing recipes to have a default category if null
update public.recipes set category = '기타' where category is null;

-- Force refresh cache
NOTIFY pgrst, 'reload config';
