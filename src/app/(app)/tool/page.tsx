import { redirect } from 'next/navigation';

import { PromptChat } from '@/components/promptmystic/prompt-chat';
import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getSubscription } from '@/features/account/controllers/get-subscription';

export default async function ToolPage() {
  const [user, subscription] = await Promise.all([getAuthUser(), getSubscription()]);

  if (!user) {
    redirect('/login');
  }

  if (!subscription) {
    redirect('/pricing');
  }

  return (
    <section className='flex h-full flex-col gap-4 py-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-semibold'>PromptMystic</h1>
        <p className='text-sm text-neutral-400'>Turn simple words into powerful, professional prompts.</p>
      </div>
      <div className='min-h-[60vh] flex-1'>
        <PromptChat />
      </div>
    </section>
  );
}
