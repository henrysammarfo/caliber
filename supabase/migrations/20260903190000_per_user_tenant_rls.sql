-- Per-user tenant isolation for Track 3 + console
-- Drop open policies; own-row only for authenticated; service_role for full access

-- query_log
drop policy if exists "Anyone can insert query_log" on public.query_log;
drop policy if exists "Users can read own query_log" on public.query_log;
drop policy if exists "Service role full access" on public.query_log;

create policy "Users insert own query_log"
  on public.query_log for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users read own query_log"
  on public.query_log for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Service role full query_log"
  on public.query_log for all
  to service_role
  using (true)
  with check (true);

grant select, insert on public.query_log to authenticated;
grant all on public.query_log to service_role;

-- analytics_events: stop authenticated read-all
drop policy if exists "Authenticated can read events" on public.analytics_events;

create policy "Users read own analytics_events"
  on public.analytics_events for select
  to authenticated
  using (auth.uid() = user_id);

-- profiles: stop authenticated view-all
drop policy if exists "Authenticated can view profiles" on public.profiles;

create policy "Users view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);
