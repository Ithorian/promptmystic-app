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

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', user.id)
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    logUnexpectedError('getSubscription', error);
  }

  // Newer supabase-js infers nested relations as `never` here; assert the
  // runtime shape defined by SubscriptionWithProduct.
  return (data as unknown as SubscriptionWithProduct | null) ?? null;
}
