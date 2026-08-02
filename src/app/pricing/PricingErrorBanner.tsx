'use client';

import { useSearchParams } from 'next/navigation';

export default function PricingErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (error !== 'checkout_failed') return null;

  return (
    <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
      <p className="font-medium">Checkout failed</p>
      <p className="text-sm mt-1">
        The selected plan is currently unavailable. Please try another plan or contact support.
      </p>
    </div>
  );
}