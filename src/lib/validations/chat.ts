// Zod Validation Contract for Customer Support Concierge Chatbot

import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  guestIdentifier: z.string().default('guest-anonymous'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    )
    .default([]),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
