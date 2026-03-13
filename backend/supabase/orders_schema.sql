create extension if not exists pgcrypto;

-- This project's backend authenticates users with Firebase and writes to Supabase
-- from the server. Use the Supabase service role key on the backend for inserts.
-- If you enable RLS, the service role bypasses it; the public anon key will not.

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id text not null,
    symbol text not null,
    side text not null check (side in ('BUY', 'SELL')),
    type text not null check (type in ('MARKET', 'LIMIT')),
    quantity double precision not null,
    price double precision,
    order_id text not null unique,
    status text not null,
    executed_qty double precision not null default 0,
    avg_price double precision not null default 0,
    created_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_id_created_at_idx
    on public.orders (user_id, created_at desc);
