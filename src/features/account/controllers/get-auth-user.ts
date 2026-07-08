import { logUnexpectedError } from '@/libs/logging';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

/**
 * Supabase returns these when there is simply no authenticated session (e.g. a
 * logged-out visitor). They are expected, benign conditions — not errors worth
 * logging on every request.
 */
function isBenignAuthError(error: { name?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.name === 'AuthSessionMissingError' || /auth session missing/i.test(error.message ?? '');
}

export async function getAuthUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && !isBenignAuthError(error)) {
    logUnexpectedError('getAuthUser', error);
  }

  return user;
}
