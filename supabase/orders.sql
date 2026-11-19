-- Run once in Supabase → SQL Editor. Creates the `orders` table used by POST /api/orders.
create table if not exists public.orders (
  id              bigint generated always as identity primary key,
  order_number    text not null unique,
  customer_name   text not null,
  email           text not null,
  phone           text not null,
  country         text not null,
  city            text not null,
  address         text not null,
  payment_method  text not null,
  payment_status  text not null default 'paid',
  items           jsonb not null,
  subtotal        numeric(10,3) not null,
  shipping        numeric(10,3) not null,
  total           numeric(10,3) not null,
  currency        text not null default 'KWD',
  demo            boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.orders enable row level security;

-- The site may only INSERT orders; nobody can read them with the public key.
drop policy if exists "site can insert orders" on public.orders;
create policy "site can insert orders"
  on public.orders for insert
  to anon, authenticated
  with check (payment_status = 'paid');

grant insert on public.orders to anon, authenticated;
