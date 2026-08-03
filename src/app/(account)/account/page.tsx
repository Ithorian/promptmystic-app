import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';

export default async function AccountPage() {
  const [session, subscription] = await Promise.all([getSession(), getSubscription()]);

  if (!session) {
    redirect('/login');
  }

  return (
    <section className='rounded-lg bg-black px-4 py-16'>
      <h1 className='mb-8 text-center'>Account</h1>

      <div className='flex flex-col gap-4'>
        <Card
          title='Your Plan'
          footer={
            subscription ? (
              <Button size='sm' variant='secondary' asChild>
                <Link href='/manage-subscription'>Manage your subscription</Link>
              </Button>
            ) : (
              <Button size='sm' variant='secondary' asChild>
                <Link href='/pricing'>Start a subscription</Link>
              </Button>
            )
          }
        >
          {subscription ? (
            <SubscriptionSummary subscription={subscription} />
          ) : (
            <p>You don&apos;t have an active subscription</p>
          )}
        </Card>
      </div>
    </section>
  );
}

function formatStatus(status: string | null): string {
  if (!status) return 'Unknown';
  // e.g. "trialing" -> "Trialing", "past_due" -> "Past due"
  const normalized = status.replace(/_/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatAmount(unitAmount: number | null, currency: string | null): string | null {
  if (unitAmount == null) return null;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency ?? 'usd').toUpperCase(),
      minimumFractionDigits: 0,
    }).format(unitAmount / 100);
  } catch {
    return `$${(unitAmount / 100).toFixed(0)}`;
  }
}

function SubscriptionSummary({
  subscription,
}: {
  subscription: NonNullable<Awaited<ReturnType<typeof getSubscription>>>;
}) {
  const price = subscription.prices;
  const product = price?.products ?? null;

  // Render everything from the subscription's joined price/product data so the
  // plan still displays even if the price has since been archived in Stripe.
  const planName = product?.name ?? 'Subscription';
  const amount = formatAmount(price?.unit_amount ?? null, price?.currency ?? null);
  const interval = price?.interval ?? null;
  const intervalLabel = amount && interval ? `${amount}/${interval}` : amount ?? null;

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-3'>
        <span className='text-xl font-semibold'>{planName}</span>
        <span className='rounded-full bg-zinc-800 px-2 py-0.5 text-xs uppercase tracking-wide text-zinc-300'>
          {formatStatus(subscription.status)}
        </span>
      </div>

      {intervalLabel && <p className='text-zinc-300'>{intervalLabel}</p>}

      {product?.description && <p className='text-sm text-zinc-400'>{product.description}</p>}

      {subscription.cancel_at_period_end && subscription.current_period_end && (
        <p className='text-sm text-amber-400'>
          Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function Card({
  title,
  footer,
  children,
}: PropsWithChildren<{
  title: string;
  footer?: ReactNode;
}>) {
  return (
    <div className='m-auto w-full max-w-3xl rounded-md bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-1 text-xl font-semibold'>{title}</h2>
        <div className='py-4'>{children}</div>
      </div>
      <div className='flex justify-end rounded-b-md border-t border-zinc-800 p-4'>{footer}</div>
    </div>
  );
}
