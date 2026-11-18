-- HIDDEN KICE 교재 스토어: products 테이블 + RLS + 더미 데이터
-- Supabase SQL Editor에서 그대로 실행하면 됩니다.

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('단품', '패스')),
  price integer not null check (price >= 0),
  discount_rate integer not null default 0 check (discount_rate >= 0 and discount_rate <= 100),
  image_url text not null,
  created_at timestamptz not null default now()
);

-- RLS 활성화 + 읽기 전용 정책 (익명 키로는 SELECT만 허용, INSERT/UPDATE/DELETE는 정책이 없어 전면 차단)
alter table products enable row level security;

drop policy if exists "Public read access" on products;
create policy "Public read access"
  on products
  for select
  to anon, authenticated
  using (true);

-- 더미 데이터 30건: 홀수=단품(정가 40,000원 고정), 짝수=패스(정가 76,000원, 할인율 5/10/15/20/25% 순환)
-- 할인가는 저장하지 않고 프론트에서 (정가 * (100 - 할인율) / 100) 로 계산합니다.
insert into products (name, type, price, discount_rate, image_url, created_at)
select
  '2026 Hidden Kice 시즌' || s::text as name,
  case when s % 2 = 0 then '패스' else '단품' end as type,
  case when s % 2 = 0 then 76000 else 40000 end as price,
  case when s % 2 = 0 then (array[5, 10, 15, 20, 25])[1 + ((s / 2 - 1) % 5)] else 0 end as discount_rate,
  case when s % 2 = 0 then '/images/cover-pass.png' else '/images/cover-single.png' end as image_url,
  now() - ((30 - s) * interval '6 hours') as created_at
from generate_series(1, 30) as s;
