'use server';

import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getOrCreateCustomer } from '@/features/account/controllers/get-or-create-customer';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getEnvVar } from '@/utils/get-env-var';

export async function createCheckoutAction(priceId: string) {
  console.log('=== CHECKOUT ACTION START ===');
  console.log('Received priceId:', priceId);

  const user = await getAuthUser();

  if (!user) {
    console.error('No authenticated user found');
    redirect('/login');
  }

  console.log('User ID:', user.id);

  if (!user.email) {
    throw new Error('Cannot start checkout: authenticated user has no email address');
  }

  // Reuse the same Stripe customer across checkouts so repeat attempts don't
  // orphan the customers -> user mapping the webhook relies on.
  const customer = await getOrCreateCustomer({ userId: user.id, email: user.email });

  const successUrl = getEnvVar(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL') + '/pricing?success=true';
  const cancelUrl = getEnvVar(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL') + '/pricing?canceled=true';

  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    mode: 'subscription',
    customer,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user.id,           // ← Important for customer mapping
    metadata: {
      userId: user.id,
    },
  });

  console.log('✅ Checkout session created:', checkoutSession.id);

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  }
}