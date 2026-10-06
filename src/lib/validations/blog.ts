// Zod Validation Contract for Gemini Editorial Studio and Blog Posts

import { z } from 'zod';

export const geminiGenerateArticleSchema = z.object({
  type: z.enum(['blog_article', 'room_copy']).default('blog_article'),
  topic: z.string().min(3, 'Topic must be at least 3 characters long').max(150),
  tone: z.enum(['editorial_luxury', 'poetic_countryside', 'architectural_heritage', 'epicurean_gastronomy']).default('editorial_luxury'),
  targetKeywords: z.array(z.string()).default([]),
  additionalNotes: z.string().max(500).optional(),
  roomId: z.string().optional(),
});

export type GeminiGenerateArticleInput = z.infer<typeof geminiGenerateArticleSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(180),
  slug: z.string().min(3).max(200),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(300),
  content: z.string().min(50, 'Content must contain at least 50 characters of markdown'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  authorName: z.string().default('The Estate Concierge'),
  published: z.boolean().default(true),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
