import { getSubscription } from '@/features/account/controllers/get-subscription';
import PricingSection from '@/features/pricing/components/pricing-section';
import { getProducts } from '@/features/pricing/controllers/get-products';

import PricingErrorBanner from './PricingErrorBanner';

export default async function PricingPage() {
  const [products, subscription] = await Promise.all([getProducts(), getSubscription()]);

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Error Banner (Client Component) */}
          <PricingErrorBanner />

          <PricingSection 
            products={products} 
            isPricingPage={true} 
            currentPriceId={subscription?.price_id ?? null}
          />
        </div>
      </div>
    </div>
  );
}