'use server';

import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getOrCreateCustomer } from '@/features/account/controllers/get-or-create-customer';
import { getSubscription } from '@/features/account/controllers/get-subscription';
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

  // Already paying for this exact plan: a second Checkout would create a
  // duplicate subscription, so send them to the billing portal instead.
  const existingSubscription = await getSubscription();

  if (existingSubscription?.price_id === priceId) {
    console.log(`[checkout] User ${user.id} already subscribed to ${priceId}; redirecting to billing portal`);
    redirect('/manage-subscription');
  }

  const siteUrl = getEnvVar(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL').replace(/\/+$/, '');

  let checkoutUrl: string | null = null;

  try {
    // Reuse the same Stripe customer across checkouts so repeat attempts don't
    // orphan the customers -> user mapping the webhook relies on.
    const customer = await getOrCreateCustomer({ userId: user.id, email: user.email });

    const checkoutSession = await stripeAdmin.checkout.sessions.create({
      mode: 'subscription',
      customer,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/account?checkout=success`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      client_reference_id: user.id,           // ← Important for customer mapping
      metadata: {
        userId: user.id,
      },
    });

    checkoutUrl = checkoutSession.url;
  } catch (error) {
    console.error('[checkout] Failed to create checkout session:', error);
    redirect('/pricing?error=checkout_failed');
  }

  if (!checkoutUrl) {
    console.error('[checkout] Stripe returned a session without a redirect URL');
    redirect('/pricing?error=checkout_failed');
  }

  redirect(checkoutUrl);
}