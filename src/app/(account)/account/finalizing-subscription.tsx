'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

const RETRY_DELAYS_MS = [2000, 5000, 10000, 15000];
const TIMEOUT_MS = 18000;

/**
 * Soft post-checkout wait state. Stripe redirects here before the webhook
 * may have written the subscription row; router.refresh() re-runs the
 * account page's server fetch until the plan appears or we time out.
 */
export function FinalizingSubscription() {
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const delay of RETRY_DELAYS_MS) {
      timers.push(setTimeout(() => router.refresh(), delay));
    }

    timers.push(setTimeout(() => setTimedOut(true), TIMEOUT_MS));

    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, [router]);

  if (timedOut) {
    return (
      <div className='flex flex-col gap-3'>
        <p>Payment received — your plan should appear shortly.</p>
        <p className='text-sm text-zinc-400'>
          Try refreshing this page. If it still doesn&apos;t show up, contact support.
        </p>
        <div>
          <Button size='sm' variant='secondary' onClick={() => router.refresh()}>
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <p>Finalizing your subscription…</p>
      <p className='text-sm text-zinc-400'>This usually takes just a few seconds.</p>
    </div>
  );
}
