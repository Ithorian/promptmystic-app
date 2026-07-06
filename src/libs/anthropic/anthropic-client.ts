import { getEnvVar } from '@/utils/get-env-var';
import Anthropic from '@anthropic-ai/sdk';

export const anthropicClient = new Anthropic({
  apiKey: getEnvVar(process.env.ANTHROPIC_API_KEY, 'ANTHROPIC_API_KEY'),
});

/**
 * The Claude model used to power the PromptMystic engine. Overridable via env
 * so the model can be tuned for quality vs cost without a code change.
 */
export const PROMPTMYSTIC_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5';

/** Max tokens for a single PromptMystic response. */
export const PROMPTMYSTIC_MAX_TOKENS = 2048;
