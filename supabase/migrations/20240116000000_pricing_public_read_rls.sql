/**
 * PRICING PUBLIC READ ACCESS (RLS)
 *
 * Root cause of the empty /pricing page: RLS is enabled on `products` and
 * `prices`, but the "Allow public read-only access." SELECT policies defined
 * in the initial migration were never actually applied to this database.
 * As a result, anon (public) requests returned zero rows *with no error*,
 * while service-role requests (which bypass RLS) saw all rows. `getProducts()`
 * uses the anon client, so the pricing page rendered empty.
 *
 * This migration is idempotent so it is safe to run on any environment.
 */

alter table public.products enable row level security;
alter table public.prices enable row level security;

-- PostgREST also requires table-level SELECT grants for the anon/authenticated
-- roles. These are granted by default on Supabase, but we assert them here so a
-- fresh or partially-provisioned database ends up in a known-good state.
grant select on table public.products to anon, authenticated;
grant select on table public.prices to anon, authenticated;

drop policy if exists "Allow public read-only access." on public.products;
create policy "Allow public read-only access."
  on public.products
  for select
  using (true);

drop policy if exists "Allow public read-only access." on public.prices;
create policy "Allow public read-only access."
  on public.prices
  for select
  using (true);
