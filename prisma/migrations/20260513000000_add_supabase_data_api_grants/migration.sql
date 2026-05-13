-- Explicit Supabase Data API grants and RLS policies for public schema tables.
-- Supabase no longer exposes newly-created public tables to anon/authenticated/service_role by default.

grant usage on schema public to anon, authenticated, service_role;

do $$
begin
  if to_regclass('public."Announcement"') is not null then
    execute 'grant select on table public."Announcement" to anon';
    execute 'grant select, insert, update, delete on table public."Announcement" to authenticated';
    execute 'grant select, insert, update, delete on table public."Announcement" to service_role';
    execute 'alter table public."Announcement" enable row level security';
    execute 'drop policy if exists "Public can read announcements" on public."Announcement"';
    execute 'drop policy if exists "Authenticated users can manage announcements" on public."Announcement"';
    execute $policy$
      create policy "Public can read announcements"
      on public."Announcement"
      for select
      to anon, authenticated
      using (true)
    $policy$;
    execute $policy$
      create policy "Authenticated users can manage announcements"
      on public."Announcement"
      for all
      to authenticated
      using (true)
      with check (true)
    $policy$;
  end if;

  if to_regclass('public."Announcement_id_seq"') is not null then
    execute 'grant usage, select on sequence public."Announcement_id_seq" to authenticated, service_role';
  end if;
end $$;

do $$
begin
  if to_regclass('public."Category"') is not null then
    execute 'grant select, insert, update, delete on table public."Category" to authenticated';
    execute 'grant select, insert, update, delete on table public."Category" to service_role';
    execute 'alter table public."Category" enable row level security';
    execute 'drop policy if exists "Authenticated users can manage categories" on public."Category"';
    execute $policy$
      create policy "Authenticated users can manage categories"
      on public."Category"
      for all
      to authenticated
      using (true)
      with check (true)
    $policy$;
  end if;

  if to_regclass('public."Category_id_seq"') is not null then
    execute 'grant usage, select on sequence public."Category_id_seq" to authenticated, service_role';
  end if;
end $$;

do $$
begin
  if to_regclass('public."Student"') is not null then
    execute 'grant select, insert, update, delete on table public."Student" to authenticated';
    execute 'grant select, insert, update, delete on table public."Student" to service_role';
    execute 'alter table public."Student" enable row level security';
    execute 'drop policy if exists "Authenticated users can manage students" on public."Student"';
    execute $policy$
      create policy "Authenticated users can manage students"
      on public."Student"
      for all
      to authenticated
      using (true)
      with check (true)
    $policy$;
  end if;

  if to_regclass('public."Student_id_seq"') is not null then
    execute 'grant usage, select on sequence public."Student_id_seq" to authenticated, service_role';
  end if;
end $$;
