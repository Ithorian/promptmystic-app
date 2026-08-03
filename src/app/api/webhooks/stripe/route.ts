import Stripe from 'stripe';

import { upsertUserSubscription } from '@/features/account/controllers/upsert-user-subscription';
import { upsertPrice } from '@/features/pricing/controllers/upsert-price';
import { upsertProduct } from '@/features/pricing/controllers/upsert-product';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { getEnvVar } from '@/utils/get-env-var';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'customer.created',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = getEnvVar(process.env.STRIPE_WEBHOOK_SECRET, 'STRIPE_WEBHOOK_SECRET');

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('[webhook] Missing signature or secret');
      return Response.json('Webhook Error: missing signature or secret', { status: 400 });
    }

    event = stripeAdmin.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`[webhook] Received event: ${event.type} (${event.id})`);
  } catch (err: any) {
    console.error(`[webhook] Signature verification failed: ${err.message}`);
    return Response.json(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProduct(event.data.object as Stripe.Product);
          break;

        case 'price.created':
        case 'price.updated':
          await upsertPrice(event.data.object as Stripe.Price);
          break;

        case 'customer.created':
          const customer = event.data.object as Stripe.Customer;
          console.log(`[webhook] Processing customer.created: ${customer.id}`);

          // Try to create mapping if userId was passed in metadata
          if (customer.metadata?.userId) {
            await supabaseAdminClient
              .from('customers')
              .upsert({
                id: customer.metadata.userId,
                stripe_customer_id: customer.id,
              });
            console.log(`[webhook] Customer mapping created via metadata for user ${customer.metadata.userId}`);
          }
          break;

        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          console.log(`[webhook] Processing checkout.session.completed: ${checkoutSession.id}`);

          // Create customer mapping using client_reference_id (more reliable)
          if (checkoutSession.customer && checkoutSession.client_reference_id) {
            await supabaseAdminClient
              .from('customers')
              .upsert({
                id: checkoutSession.client_reference_id,
                stripe_customer_id: checkoutSession.customer as string,
              });
          }

          if (checkoutSession.mode === 'subscription' && checkoutSession.subscription) {
            await upsertUserSubscription({
              subscriptionId: checkoutSession.subscription as string,
              customerId: checkoutSession.customer as string,
              userId: checkoutSession.client_reference_id || undefined,   // ← Pass the user ID
              isCreateAction: true,
            });
          }
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[webhook] Processing ${event.type}: ${subscription.id}`);
          await upsertUserSubscription({
            subscriptionId: subscription.id,
            customerId: subscription.customer as string,
            isCreateAction: false,
          });
          break;

        default:
          console.warn(`[webhook] Unhandled relevant event: ${event.type}`);
      }
    } catch (error: any) {
      console.error(`[webhook] Handler failed for ${event.type} (${event.id}):`, error);
      return Response.json('Webhook handler failed', { status: 400 });
    }
  } else {
    console.log(`[webhook] Ignored event type: ${event.type}`);
  }

  return Response.json({ received: true });
}