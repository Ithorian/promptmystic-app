/**
 * SUBSCRIPTIONS OWNER READ ACCESS (RLS)
 *
 * Root cause of /account showing "You don't have an active subscription" even
 * though the Stripe webhook wrote an `active` row: RLS is enabled on
 * `subscriptions`, but the "Can only view own subs data." SELECT policy defined
 * in the initial migration was never actually applied to this database (the
 * same problem previously fixed for `products`/`prices`). With RLS enabled and
 * no effective SELECT policy/grant, anon+authenticated requests return zero
 * rows *with no error*, while service-role requests (the webhook) bypass RLS
 * and write successfully. `getSubscription()` uses the user-scoped client, so
 * it silently saw nothing.
 *
 * This migration is idempotent so it is safe to run on any environment.
 */

alter table public.subscriptions enable row level security;

-- PostgREST also requires a table-level SELECT grant for the authenticated
-- role. Granted by default on Supabase, but asserted here so a fresh or
-- partially-provisioned database ends up in a known-good state.
grant select on table public.subscriptions to authenticated;

drop policy if exists "Can only view own subs data." on public.subscriptions;
create policy "Can only view own subs data."
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);
