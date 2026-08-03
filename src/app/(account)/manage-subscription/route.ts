import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getCustomerId } from '@/features/account/controllers/get-customer-id';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Get the user, validated against the auth server rather than read from
  // the session cookie.
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Retrieve or create the customer in Stripe
  const customer = await getCustomerId({
    userId: user.id,
  });

  if (!customer) {
    throw Error('Could not get customer');
  }

  // 3. Create portal link and redirect user
  const { url } = await stripeAdmin.billingPortal.sessions.create({
    customer,
    return_url: `${getURL()}/account`,
  });

  redirect(url);
}
