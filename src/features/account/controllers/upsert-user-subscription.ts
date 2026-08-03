import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { Database } from '@/libs/supabase/types';
import { toDateTime } from '@/utils/to-date-time';

/**
 * PostgREST returns timestamps as `2026-08-18 02:43:12+00` while the values we
 * derive from Stripe are ISO strings, so the two are never equal as text.
 * Compare the instants instead, and treat anything unparseable as "changed" so
 * an ambiguous case falls through to the (idempotent) upsert.
 */
function sameInstant(stored: string | null, incoming: string | null): boolean {
  if (!stored && !incoming) return true;
  if (!stored || !incoming) return false;

  const storedMs = new Date(stored).getTime();
  const incomingMs = new Date(incoming).getTime();

  if (Number.isNaN(storedMs) || Number.isNaN(incomingMs)) return false;

  return storedMs === incomingMs;
}

export async function upsertUserSubscription({
  subscriptionId,
  customerId,
  userId,
  isCreateAction = false,
}: {
  subscriptionId: string;
  customerId: string;
  userId?: string;
  isCreateAction?: boolean;
}) {
  let resolvedUserId = userId;

  // Try to find existing customer mapping
  const { data: customerData } = await supabaseAdminClient
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (customerData) {
    resolvedUserId = customerData.id;
  } else if (resolvedUserId) {
    // Fallback: Create customer mapping if we have the userId
    const { error: insertError } = await supabaseAdminClient
      .from('customers')
      .insert({
        id: resolvedUserId,
        stripe_customer_id: customerId,
      });

    if (insertError) {
      console.error('[upsertUserSubscription] Failed to create customer mapping:', insertError);
      throw new Error(`Could not create customer mapping for ${customerId}`);
    }

    console.log(`[upsertUserSubscription] Created customer mapping for user ${resolvedUserId}`);
  } else {
    throw new Error(`No customer found for Stripe customer: ${customerId} and no userId provided`);
  }

  // Retrieve full subscription from Stripe
  const subscription = await stripeAdmin.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });

  const price = subscription.items.data[0].price;
  const currentPeriodEnd = toDateTime(subscription.current_period_end).toISOString();
  const trialEnd = subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null;

  // Check if subscription already exists (prevent duplicate upserts)
  const { data: existingSubscription } = await supabaseAdminClient
    .from('subscriptions')
    .select('status, cancel_at_period_end, current_period_end, price_id, trial_end')
    .eq('id', subscriptionId)
    .single();

  if (existingSubscription) {
    const isUnchanged =
      existingSubscription.status === subscription.status &&
      existingSubscription.cancel_at_period_end === subscription.cancel_at_period_end &&
      existingSubscription.price_id === price.id &&
      sameInstant(existingSubscription.current_period_end, currentPeriodEnd) &&
      sameInstant(existingSubscription.trial_end, trialEnd);

    if (isUnchanged) {
      console.log(
        `[upsertUserSubscription] No changes detected for subscription ${subscriptionId}. Skipping upsert.`
      );
      return;
    }
  }

  // Prepare subscription data
  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = {
    id: subscription.id,
    user_id: resolvedUserId,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: price.id,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_start: toDateTime(subscription.current_period_start).toISOString(),
    current_period_end: currentPeriodEnd,
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
    trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
    trial_end: trialEnd,
  };

  const { error: upsertError } = await supabaseAdminClient
    .from('subscriptions')
    .upsert([subscriptionData]);

  if (upsertError) {
    console.error('[upsertUserSubscription] Error:', upsertError);
    throw upsertError;
  }

  console.info(`[upsertUserSubscription] Subscription ${subscription.id} upserted for user ${resolvedUserId}`);
}