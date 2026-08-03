'use client';

import { useState } from 'react';

import { BillingToggle } from './billing-toggle';
import { PricingCard } from './price-card';

interface PricingSectionProps {
  products: any[];
  isPricingPage?: boolean;
  currentPriceId?: string | null;
}

export default function PricingSection({ products, isPricingPage, currentPriceId }: PricingSectionProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const HeadingLevel = isPricingPage ? 'h1' : 'h2';

  // Only show plans that are actually purchasable at the selected interval.
  // This keeps the cards driven purely by real Stripe prices, so a product
  // without a recurring price for this interval simply doesn't render.
  const purchasableProducts = products.filter((product: any) =>
    product.prices?.some((price: any) => price.interval === billingInterval && price.unit_amount > 0)
  );

  // Sort products: Starter → Pro → Premium
  const sortedProducts = [...purchasableProducts].sort((a, b) => {
    const order = ['Starter', 'Pro', 'Premium'];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <section className="relative rounded-lg bg-black py-8">
      <div className="relative z-10 m-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 pt-8 lg:pt-[140px]">
        
        {/* Heading */}
        <HeadingLevel className="max-w-4xl bg-gradient-to-br from-white to-neutral-200 bg-clip-text text-center text-4xl font-bold text-transparent lg:text-6xl">
          Predictable pricing for every use case.
        </HeadingLevel>

        <p className="text-center text-xl">
          Find a plan that fits you. Upgrade at any time to enable additional features.
        </p>

        {/* Billing Toggle */}
        <BillingToggle 
          billingInterval={billingInterval} 
          onChange={setBillingInterval} 
        />

        {/* Pricing Cards */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {sortedProducts.length === 0 ? (
            <p className="text-center text-neutral-400">
              No plans are available right now. Please check back soon.
            </p>
          ) : (
            sortedProducts.map((product: any) => (
              <PricingCard 
                key={product.id} 
                product={product} 
                billingInterval={billingInterval} 
                currentPriceId={currentPriceId}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}