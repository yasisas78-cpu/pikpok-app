create table if not exists public.videos (
  id text primary key default gen_random_uuid()::text,
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  tags text[] not null default '{}',
  video_url text not null,
  poster_url text,
  product_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.video_likes (
  video_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (video_id, user_id)
);

create table if not exists public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  user_name text not null,
  user_avatar text not null,
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;
alter table public.video_likes enable row level security;
alter table public.video_comments enable row level security;

create policy "Public videos are readable" on public.videos for select using (true);
create policy "Users can publish their own videos" on public.videos for insert with check (auth.uid() = creator_id);
create policy "Users can delete their own videos" on public.videos for delete using (auth.uid() = creator_id);

create policy "Public likes are readable" on public.video_likes for select using (true);
create policy "Users can like as themselves" on public.video_likes for insert with check (auth.uid() = user_id);
create policy "Users can remove their own likes" on public.video_likes for delete using (auth.uid() = user_id);

create policy "Public comments are readable" on public.video_comments for select using (true);
create policy "Users can comment as themselves" on public.video_comments for insert with check (auth.uid() = user_id);
create policy "Users can delete their own comments" on public.video_comments for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

create policy "Public video files are readable" on storage.objects for select using (bucket_id = 'videos');
create policy "Users can upload video files" on storage.objects for insert with check (bucket_id = 'videos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can delete their video files" on storage.objects for delete using (bucket_id = 'videos' and auth.uid()::text = (storage.foldername(name))[1]);

alter table public.video_likes replica identity full;
alter table public.video_comments replica identity full;
alter publication supabase_realtime add table public.video_likes;
alter publication supabase_realtime add table public.video_comments;
