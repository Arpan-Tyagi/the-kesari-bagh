// Zod Validation Contract for Event Inquiries

import { z } from 'zod';

export const eventInquirySchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[+]?[0-9\s-]{10,15}$/, 'Please enter a valid phone number'),
  eventType: z.enum([
    'intimate_wedding',
    'corporate_retreat',
    'celebration',
    'video_shoot',
    'farm_picnic',
  ]),
  guestCount: z.coerce
    .number()
    .int()
    .min(1, 'Minimum 1 guest')
    .max(50, 'The Kesari Bagh estate accommodates up to 50 guests for daytime events'),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date required (YYYY-MM-DD)'),
  message: z.string().min(10, 'Please share additional details (at least 10 characters)').max(1000),
});

export type EventInquiryInput = z.infer<typeof eventInquirySchema>;
