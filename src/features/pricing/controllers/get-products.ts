import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

import { ProductWithPrices } from '../types';

export async function getProducts(): Promise<ProductWithPrices[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  if (error) {
    console.error(error.message);
  }

  // The Supabase client's nested-relation inference resolves to `never` for the
  // products/prices join under newer supabase-js, so we assert the shape we
  // actually get back at runtime (defined by ProductWithPrices).
  return (data as unknown as ProductWithPrices[] | null) ?? [];
}
