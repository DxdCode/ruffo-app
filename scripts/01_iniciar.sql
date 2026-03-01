
/* CREAR UN BUCKET NOMBRE DE: "pets"*/
/* EN ESTADO PUBLICO */

create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  species text not null check (species in ('canino', 'felino', 'otro')),
  breed text,
  behavior_notes text,
  image_url text,
  created_at timestamp with time zone default now()
);

alter table public.clients enable row level security;
alter table public.pets enable row level security;

create policy "Autenticado acceso completo clientes"
  on public.clients for all
  to authenticated
  using (true) with check (true);

create policy "Autenticado acceso completo mascotas"
  on public.pets for all
  to authenticated
  using (true) with check (true);


create policy "Autenticado puede ver imagenes de mascotas"
  on storage.objects for select
  using ( bucket_id = 'pets' );

create policy "Autenticado puede subir imagenes de mascotas"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'pets' );