function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

/**
 * Logs errors that are genuinely unexpected. In development the full error
 * object is logged for debugging; in production only the message is logged to
 * keep aggregated logs clean and avoid dumping large objects or stack traces.
 *
 * `scope` is a short label (usually the calling function) that prefixes the log
 * so its origin is easy to grep, e.g. logUnexpectedError('getAuthUser', err).
 */
export function logUnexpectedError(scope: string, error: unknown): void {
  if (process.env.NODE_ENV === 'production') {
    console.error(`[${scope}] ${getErrorMessage(error)}`);
  } else {
    console.error(`[${scope}]`, error);
  }
}
