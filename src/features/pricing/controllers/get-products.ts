import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function getProducts() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index');

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}