import { z } from 'zod';

export const characterFormSchema = z.object({
  name: z.string().min(2).max(32),
  tagline: z.string().min(5).max(80),
  backstory: z.string().min(20).max(600),
  tone: z.enum(['friendly', 'mentor', 'playful', 'romantic', 'professional']),
  interests: z.array(z.string().min(2)).min(1).max(8),
  avatar: z.string().min(1).max(2)
});

export const messageSchema = z.object({
  text: z.string().trim().min(1).max(1200)
});
