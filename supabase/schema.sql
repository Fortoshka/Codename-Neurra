/*
  Полный сброс объектов приложения в схеме public и пересоздание с нуля.
  Выполните целиком в Supabase → SQL Editor (одна вкладка, Run).

  Важно:
  - Удаляются только public.purchased_services, public.profiles и связанные триггеры/функции.
  - Таблица auth.users не трогается. Чтобы «обнулить» аккаунты, удалите пользователей в
    Dashboard → Authentication → Users (или оставьте — триггер снова создаст профили при новых регистрациях).
*/

-- ============================ 1. УДАЛЕНИЕ СТАРОГО ============================

drop trigger if exists on_auth_user_created on auth.users;

drop trigger if exists profiles_set_updated_at on public.profiles;

drop policy if exists "Пользователь видит только свои услуги" on public.purchased_services;
drop policy if exists purchased_services_select_own on public.purchased_services;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;

drop table if exists public.purchased_services cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_profiles_updated_at() cascade;

-- ============================ 2. ТАБЛИЦЫ ============================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.purchased_services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index purchased_services_user_id_idx on public.purchased_services (user_id);

-- ============================ 3. ФУНКЦИИ И ТРИГГЕРЫ ============================

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Пользователь'),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

-- Совместимость: на старых кластерах замените строку ниже на:
--   for each row execute procedure public.handle_new_user();
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================ 4. RLS ============================

alter table public.profiles enable row level security;
alter table public.purchased_services enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy purchased_services_select_own
  on public.purchased_services
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ============================ 5. ПРАВА (типично для Supabase) ============================

grant usage on schema public to anon, authenticated, service_role;

grant select, update on table public.profiles to authenticated;
grant select on table public.purchased_services to authenticated;

grant all on table public.profiles to service_role;
grant all on table public.purchased_services to service_role;

-- ============================ 6. ПРОФИЛИ ДЛЯ УЖЕ СУЩЕСТВУЮЩИХ ПОЛЬЗОВАТЕЛЕЙ AUTH ============================
-- После удаления таблицы profiles старые аккаунты остаются в auth.users — восстанавливаем строки.

insert into public.profiles (id, name, email)
select
  u.id,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'Пользователь'),
  coalesce(u.email, '')
from auth.users u
on conflict (id) do update
set
  name = excluded.name,
  email = excluded.email,
  updated_at = now();

/*
  Если execute function выдаёт синтаксическую ошибку, выполните вручную:
    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
*/
