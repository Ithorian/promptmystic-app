import {
  anthropicClient,
  PROMPTMYSTIC_MAX_TOKENS,
  PROMPTMYSTIC_MODEL,
} from '@/libs/anthropic/anthropic-client';

import { PROMPTMYSTIC_SYSTEM_PROMPT } from '../system-prompt';
import { ChatMessage } from '../types';

/**
 * Streams a PromptMystic response for the given conversation as a
 * ReadableStream of UTF-8 text chunks, suitable for returning directly from a
 * route handler. The full SKILL.md-derived persona is applied as the system
 * prompt on every turn so the multi-turn clarifying flow behaves consistently.
 */
export function generatePromptStream(messages: ChatMessage[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = anthropicClient.messages.stream({
          model: PROMPTMYSTIC_MODEL,
          max_tokens: PROMPTMYSTIC_MAX_TOKENS,
          system: PROMPTMYSTIC_SYSTEM_PROMPT,
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        });

        stream.on('text', (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await stream.finalMessage();
        controller.close();
      } catch (error) {
        console.error('PromptMystic generation failed:', error);
        controller.error(error);
      }
    },
  });
}
