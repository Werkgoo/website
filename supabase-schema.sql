-- ============================================================
-- Autobedrijf De Heems — database voor de occasionvoorraad
--
-- Zo zet je het aan:
--   1. Maak een gratis project op supabase.com
--   2. Plak dit hele bestand in de SQL Editor en voer het uit
--   3. Maak onder Authentication > Users een gebruiker aan
--      (het e-mailadres en wachtwoord waarmee je op /beheer inlogt)
--   4. Zet Project URL en de publishable/anon key in config.js
-- ============================================================

create table if not exists public.occasions (
  id            text primary key,
  merk          text not null,
  model         text not null,
  uitvoering    text,
  carrosserie   text,
  prijs         integer not null default 0,
  prijs_type    text default 'rijklaar',      -- rijklaar | excl_btw
  status        text not null default 'beschikbaar', -- beschikbaar | gereserveerd | verkocht
  label         text,
  bouwjaar      integer,
  km            integer default 0,
  brandstof     text,
  transmissie   text,
  vermogen      text,
  deuren        integer,
  kleur         text,
  eigenaren     integer,
  apk_tot       text,
  fotos         jsonb default '[]'::jsonb,
  opties        jsonb default '[]'::jsonb,
  omschrijving  text,
  aangemaakt    timestamptz default now()
);

alter table public.occasions enable row level security;

-- De website mag de voorraad lezen (dat is publieke informatie).
drop policy if exists "occasions publiek lezen" on public.occasions;
create policy "occasions publiek lezen"
  on public.occasions for select
  using (true);

-- Alleen wie is ingelogd op /beheer mag toevoegen, wijzigen en verwijderen.
drop policy if exists "occasions beheer schrijven" on public.occasions;
create policy "occasions beheer schrijven"
  on public.occasions for all
  to authenticated
  using (true) with check (true);

-- Opslag voor de foto's.
insert into storage.buckets (id, name, public)
values ('occasion-fotos', 'occasion-fotos', true)
on conflict (id) do nothing;

drop policy if exists "occasionfotos publiek lezen" on storage.objects;
create policy "occasionfotos publiek lezen"
  on storage.objects for select
  using (bucket_id = 'occasion-fotos');

drop policy if exists "occasionfotos beheer uploaden" on storage.objects;
create policy "occasionfotos beheer uploaden"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'occasion-fotos');

drop policy if exists "occasionfotos beheer verwijderen" on storage.objects;
create policy "occasionfotos beheer verwijderen"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'occasion-fotos');
