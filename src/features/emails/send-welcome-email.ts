import { resendClient } from '@/libs/resend/resend-client';

import { WelcomeEmail } from './welcome';

/**
 * Sender identity for transactional email. Defaults to Resend's shared test
 * domain (which only delivers to your own Resend account email) so the flow
 * works in development without domain verification. Set RESEND_FROM_EMAIL to a
 * verified domain address (e.g. "PromptMystic <hello@promptmystic.com>") for
 * production.
 */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'PromptMystic <onboarding@resend.dev>';

export async function sendWelcomeEmail(to: string): Promise<void> {
  try {
    await resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to PromptMystic ✨',
      react: WelcomeEmail(),
    });
  } catch (error) {
    // Never block the auth flow on a failed welcome email.
    console.error('Failed to send welcome email:', error);
  }
}
