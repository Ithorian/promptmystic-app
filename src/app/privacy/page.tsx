export default function PrivacyPage() {
  return (
    <section className='m-auto max-w-2xl rounded-lg bg-black px-6 py-16'>
      <h1 className='mb-4 text-3xl font-bold'>Privacy Policy</h1>
      <p className='text-neutral-400'>
        PromptMystic respects your privacy. We collect only the information needed to provide the service —
        your account details and subscription status. We do not sell your data. A full privacy policy will be
        published before general availability. Questions? Reach us on the{' '}
        <a href='/support' className='underline'>
          support
        </a>{' '}
        page.
      </p>
    </section>
  );
}
