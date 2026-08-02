import PricingSection from '@/features/pricing/components/pricing-section';
import { getProducts } from '@/features/pricing/controllers/get-products';

export default async function PricingPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black">
      {/* Optional top padding / header space */}
      <div className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <PricingSection 
            products={products} 
            isPricingPage={true} 
          />
        </div>
      </div>
    </div>
  );
}