import Stripe from 'stripe';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { Database } from '@/libs/supabase/types';

type Product = Database['public']['Tables']['products']['Insert'];

export async function upsertProduct(product: Stripe.Product) {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
    created: product.created
      ? new Date(product.created * 1000).toISOString()
      : null,
    updated: product.updated
      ? new Date(product.updated * 1000).toISOString()
      : new Date().toISOString(), // fallback to now if Stripe doesn't provide it
  };

  const { error } = await supabaseAdminClient
    .from('products')
    .upsert([productData], { onConflict: 'id' });

  if (error) {
    console.error(`[upsertProduct] Failed to upsert product ${product.id}:`, error);
    throw error;
  } else {
    console.info(`Product inserted/updated: ${product.id}`);
  }
}