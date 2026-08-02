import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { generatePromptStream } from '@/features/promptmystic/controllers/generate-prompt-stream';
import { checkRateLimit } from '@/features/promptmystic/rate-limit';
import { generateRequestSchema } from '@/features/promptmystic/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // 1. Require an authenticated user (verified against Supabase Auth).
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: 'You must be signed in to use PromptMystic.' }, { status: 401 });
  }

  // 2. Hard gate: require an active subscription (never trust the UI alone).
  const subscription = await getSubscription();
  if (!subscription) {
    return Response.json({ error: 'An active subscription is required.' }, { status: 402 });
  }

  // 3. Basic per-user rate limiting to protect API cost.
  const { allowed, retryAfterSeconds } = checkRateLimit(user.id);
  if (!allowed) {
    return Response.json(
      { error: 'You are sending messages too quickly. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  // 4. Validate the request body (also caps input length via the schema).
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid message format.' }, { status: 400 });
  }

  // 5. Stream the PromptMystic response back to the client.
  const stream = generatePromptStream(parsed.data.messages);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
