-- 1. Notifications Table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null, -- Who receives the notification
  actor_id uuid references public.profiles(id), -- Who triggered it (e.g. liker)
  type text check (type in ('like', 'comment', 'remix', 'follow')) not null,
  recipe_id uuid references public.recipes(id), -- Related Content
  message text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RLS Policies
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications (mark as read)"
  on public.notifications for update
  using (auth.uid() = user_id);

-- 3. Triggers to Auto-Generate Notifications

-- Trigger for LIKES
create or replace function public.handle_new_like()
returns trigger as $$
begin
  if new.user_id != (select user_id from public.recipes where id = new.recipe_id) then
    insert into public.notifications (user_id, actor_id, type, recipe_id, message)
    values (
      (select user_id from public.recipes where id = new.recipe_id), -- Recipient (Recipe Owner)
      new.user_id, -- Actor (Liker)
      'like',
      new.recipe_id,
      '누군가 회원님의 레시피를 좋아합니다.'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_new_like on public.likes;
create trigger on_new_like
  after insert on public.likes
  for each row execute function public.handle_new_like();

-- Trigger for COMMENTS
create or replace function public.handle_new_comment()
returns trigger as $$
begin
  if new.user_id != (select user_id from public.recipes where id = new.recipe_id) then
    insert into public.notifications (user_id, actor_id, type, recipe_id, message)
    values (
      (select user_id from public.recipes where id = new.recipe_id),
      new.user_id,
      'comment',
      new.recipe_id,
      -- Extract a snippet of the comment
      '새 댓글: ' || substring(new.content from 1 for 20) || '...'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_new_comment on public.comments;
create trigger on_new_comment
  after insert on public.comments
  for each row execute function public.handle_new_comment();
