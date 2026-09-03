-- Track 3: query_log for Telegraph intelligence console
create table if not exists public.query_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  intent text not null,
  query_text text,
  miner_slug text,
  miner_id int,
  response jsonb,
  confidence float,
  x402_tx text,
  cost_usdc float,
  created_at timestamptz default now()
);

-- RLS: anyone can insert (public checker has no auth), authenticated can read own
alter table public.query_log enable row level security;

create policy "Anyone can insert query_log"
  on public.query_log for insert
  with check (true);

create policy "Users can read own query_log"
  on public.query_log for select
  using (auth.uid() = user_id);

create policy "Service role full access"
  on public.query_log for all
  using (true)
  with check (true);

-- Index for analytics queries
create index idx_query_log_intent on public.query_log(intent);
create index idx_query_log_created_at on public.query_log(created_at);
create index idx_query_log_user_id on public.query_log(user_id);
