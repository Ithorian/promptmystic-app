import PricingSection from '@/features/pricing/components/pricing-section';
import { getProducts } from '@/features/pricing/controllers/get-products';

import PricingErrorBanner from './PricingErrorBanner';

export default async function PricingPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Error Banner (Client Component) */}
          <PricingErrorBanner />

          <PricingSection 
            products={products} 
            isPricingPage={true} 
          />
        </div>
      </div>
    </div>
  );
}