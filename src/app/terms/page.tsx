export default function TermsPage() {
  return (
    <section className='m-auto max-w-2xl rounded-lg bg-black px-6 py-16'>
      <h1 className='mb-4 text-3xl font-bold'>Terms of Service</h1>
      <p className='text-neutral-400'>
        By using PromptMystic you agree to use the service lawfully and not to abuse the prompt generation
        engine. Subscriptions are billed through Stripe and can be managed or cancelled at any time from your
        account. A full terms of service will be published before general availability.
      </p>
    </section>
  );
}
