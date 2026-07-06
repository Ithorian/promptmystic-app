import Link from 'next/link';
import { IoChatbubblesOutline, IoRocketOutline, IoSparklesOutline } from 'react-icons/io5';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { PricingSection } from '@/features/pricing/components/pricing-section';

export default async function HomePage() {
  return (
    <div className='flex flex-col gap-8 lg:gap-32'>
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className='relative overflow-hidden lg:overflow-visible'>
      <Container className='relative rounded-lg bg-black py-20 lg:py-[140px]'>
        <div className='relative z-10 m-auto flex max-w-2xl flex-col items-center gap-5 text-center'>
          <div className='w-fit rounded-full bg-gradient-to-r from-[#616571] via-[#7782A9] to-[#826674] px-4 py-1'>
            <span className='font-alt text-sm font-semibold text-black mix-blend-soft-light'>
              AI that works for you, not against you
            </span>
          </div>
          <h1>Turn simple words into powerful, professional prompts.</h1>
          <p className='max-w-xl text-lg text-neutral-400'>
            Tell PromptMystic what you want in plain language. We craft a well-engineered prompt that gets
            you strong results from Claude and GPT-4o — no prompt engineering skills required.
          </p>
          <Button asChild variant='sexy'>
            <Link href='/signup'>Get started</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: IoChatbubblesOutline,
      title: 'Say it in plain words',
      description: 'Describe what you want like you would to a helpful friend. No jargon, no pressure.',
    },
    {
      icon: IoSparklesOutline,
      title: 'We engineer the prompt',
      description: 'PromptMystic asks a few gentle questions, then builds a polished, professional prompt.',
    },
    {
      icon: IoRocketOutline,
      title: 'Copy, paste, and shine',
      description: 'Paste your ready-to-use prompt into Claude or ChatGPT and get results that feel like magic.',
    },
  ];

  return (
    <section className='flex flex-col gap-8 rounded-lg bg-black px-4 py-12 lg:py-16'>
      <h2 className='text-center text-3xl font-bold'>How PromptMystic works</h2>
      <div className='grid gap-6 lg:grid-cols-3'>
        {steps.map((step) => (
          <div key={step.title} className='flex flex-col items-center gap-3 rounded-md bg-zinc-900 p-8 text-center'>
            <step.icon size={32} className='text-neutral-300' />
            <h3 className='text-xl font-semibold'>{step.title}</h3>
            <p className='text-sm text-neutral-400'>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
