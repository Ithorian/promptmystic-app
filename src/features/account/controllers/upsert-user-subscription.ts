import Stripe from 'stripe';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { Database } from '@/libs/supabase/types';
import { toDateTime } from '@/utils/to-date-time';

export async function upsertUserSubscription({
  subscriptionId,
  customerId,
  isCreateAction = false,
}: {
  subscriptionId: string;
  customerId: string;
  isCreateAction?: boolean;
}) {
  // Get user_id from customers table
  const { data: customerData, error: customerError } = await supabaseAdminClient
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (customerError || !customerData) {
    throw new Error(`No customer found for Stripe customer: ${customerId}`);
  }

  const userId = customerData.id;

  // Retrieve full subscription from Stripe
  const subscription = await stripeAdmin.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });

  const price = subscription.items.data[0].price;

  // Prepare subscription data (removed product_id for now)
  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = {
    id: subscription.id,
    user_id: userId,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: price.id,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
    canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
    current_period_start: toDateTime(subscription.current_period_start).toISOString(),
    current_period_end: toDateTime(subscription.current_period_end).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
    trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
    trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
  };

  const { error: upsertError } = await supabaseAdminClient
    .from('subscriptions')
    .upsert([subscriptionData]);

  if (upsertError) {
    console.error('[upsertUserSubscription] Error:', upsertError);
    throw upsertError;
  }

  console.info(`[upsertUserSubscription] Subscription ${subscription.id} upserted for user ${userId}`);

  // Only copy billing details for new subscriptions (commented out for now due to schema)
  // if (isCreateAction && subscription.default_payment_method && userId) {
  //   await copyBillingDetailsToCustomer(userId, subscription.default_payment_method as Stripe.PaymentMethod);
  // }
}

// Temporarily disabled - requires 'users' table + billing_address/payment_method columns
// const copyBillingDetailsToCustomer = async (...) => { ... }