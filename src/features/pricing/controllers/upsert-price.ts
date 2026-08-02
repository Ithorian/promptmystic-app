import Stripe from 'stripe';

import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { Database } from '@/libs/supabase/types';

import { upsertProduct } from './upsert-product';

type Price = Database['public']['Tables']['prices']['Insert'];

export async function upsertPrice(price: Stripe.Price) {
  // Ensure we have the product ID
  const productId = typeof price.product === 'string' 
    ? price.product 
    : price.product.id;

  if (!productId) {
    console.warn(`[upsertPrice] Missing product ID for price ${price.id}`);
    return;
  }

  // === FIX: Ensure the product exists first ===
  try {
    const product = await stripeAdmin.products.retrieve(productId);
    await upsertProduct(product);
  } catch (error) {
    console.error(`[upsertPrice] Failed to retrieve/upsert product ${productId}:`, error);
    // Still attempt to insert the price — it may succeed later
  }

  const priceData: Price = {
    id: price.id,
    product_id: productId,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdminClient
    .from('prices')
    .upsert([priceData], { onConflict: 'id' });

  if (error) {
    throw error;
  } else {
    console.info(`Price inserted/updated: ${price.id}`);
  }
}