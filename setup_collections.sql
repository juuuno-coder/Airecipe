-- 1. Create Collections Table (Folders)
create table if not exists collections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Collection Items Table (Mapping)
create table if not exists collection_items (
  collection_id uuid references collections(id) on delete cascade not null,
  recipe_id uuid references recipes(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (collection_id, recipe_id)
);

-- 3. Enable RLS
alter table collections enable row level security;
alter table collection_items enable row level security;

-- 4. RLS Policies for Collections
create policy "Users can view their own collections"
  on collections for select
  using (auth.uid() = user_id);

create policy "Users can create their own collections"
  on collections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own collections"
  on collections for update
  using (auth.uid() = user_id);

create policy "Users can delete their own collections"
  on collections for delete
  using (auth.uid() = user_id);

-- 5. RLS Policies for Collection Items
create policy "Users can view items in their collections"
  on collection_items for select
  using (
    exists (
      select 1 from collections
      where collections.id = collection_items.collection_id
      and collections.user_id = auth.uid()
    )
  );

create policy "Users can add items to their collections"
  on collection_items for insert
  with check (
    exists (
      select 1 from collections
      where collections.id = collection_items.collection_id
      and collections.user_id = auth.uid()
    )
  );

create policy "Users can remove items from their collections"
  on collection_items for delete
  using (
    exists (
      select 1 from collections
      where collections.id = collection_items.collection_id
      and collections.user_id = auth.uid()
    )
  );
