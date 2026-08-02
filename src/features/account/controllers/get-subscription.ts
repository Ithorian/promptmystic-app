import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { SubscriptionWithProduct } from '@/features/pricing/types';
import { logUnexpectedError } from '@/libs/logging';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function getSubscription(): Promise<SubscriptionWithProduct | null> {
  const user = await getAuthUser();
  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  // NOTE: we intentionally do NOT use .single()/.maybeSingle() here. Those send
  // the `application/vnd.pgrst.object+json` Accept header, which makes PostgREST
  // throw PGRST116 when the user has more than one active/trialing row (common
  // during testing or mid-upgrade). Instead we fetch an ordered list and take
  // the first, which is robust for any row count.
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', user.id)
    .in('status', ['trialing', 'active'])
    .order('current_period_end', { ascending: false })
    .limit(1);

  if (error) {
    logUnexpectedError('getSubscription', error);
    return null;
  }

  // Newer supabase-js infers nested relations as `never` here; assert the
  // runtime shape defined by SubscriptionWithProduct.
  const subscription = (data?.[0] as unknown as SubscriptionWithProduct | undefined) ?? null;

  // A missing subscription is an expected, benign state (user hasn't paid yet),
  // so log it at info level rather than as an error.
  if (!subscription) {
    console.info(`[getSubscription] No active subscription for user ${user.id}`);
  }

  return subscription;
}
