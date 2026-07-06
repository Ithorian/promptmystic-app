import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import tailwindConfig from './tailwind.config';

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to PromptMystic</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className='mx-auto my-auto bg-slate-500 px-2 py-10 font-sans'>
          <Container className='mx-auto mt-[40px] w-[464px] overflow-hidden rounded-md bg-white'>
            <Section className='h-[180px] w-full bg-black'>
              <Heading className='mb-0 mt-[60px] text-center text-[40px] font-bold text-white'>
                Welcome ✨
              </Heading>
            </Section>
            <Section className='p-8'>
              <Heading as='h2' className='m-0 text-[24px] font-bold'>
                Thanks for joining PromptMystic.
              </Heading>
              <Text className='my-6 text-[16px]'>
                You did the hard part — you had the idea. Now let us polish it. Open PromptMystic and turn
                your simple words into powerful, professional prompts.
              </Text>
              <Button href={baseUrl + '/tool'} className='rounded-md bg-black px-4 py-2 font-medium text-white'>
                Open PromptMystic
              </Button>
            </Section>
          </Container>
          <Container className='mx-auto mt-4'>
            <Section className='text-center'>
              <Text className='m-0 text-xs text-white'>Not interested in receiving this email?</Text>
              <Link className='text-center text-xs text-white underline' href={baseUrl + '/account'}>
                Turn off this notification in your account settings.
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
