import { z } from 'zod';

export const chatRoleSchema = z.enum(['user', 'assistant']);

export const MAX_MESSAGE_LENGTH = 8000;

export const chatMessageSchema = z.object({
  role: chatRoleSchema,
  content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

export const generateRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(40),
});

export type ChatRole = z.infer<typeof chatRoleSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;
