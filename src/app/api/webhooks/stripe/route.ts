// src/app/api/webhooks/stripe/route.ts

import Stripe from 'stripe';
import { upsertProduct } from '@/features/pricing/controllers/upsert-product';
import { upsertPrice } from '@/features/pricing/controllers/upsert-price';
import { upsertUserSubscription } from '@/features/account/controllers/upsert-user-subscription';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getEnvVar } from '@/utils/get-env-var';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
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
          console.log(`[webhook] Processing product: ${event.data.object.id}`);
          await upsertProduct(event.data.object as Stripe.Product);
          break;

        case 'price.created':
        case 'price.updated':
          console.log(`[webhook] Processing price: ${event.data.object.id}`);
          await upsertPrice(event.data.object as Stripe.Price);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[webhook] Processing subscription: ${subscription.id}`);
          await upsertUserSubscription({
            subscriptionId: subscription.id,
            customerId: subscription.customer as string,
            isCreateAction: false,
          });
          break;

        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          console.log(`[webhook] Processing checkout.session.completed: ${checkoutSession.id}`);

          if (checkoutSession.mode === 'subscription' && checkoutSession.subscription) {
            await upsertUserSubscription({
              subscriptionId: checkoutSession.subscription as string,
              customerId: checkoutSession.customer as string,
              isCreateAction: true,
            });
          }
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