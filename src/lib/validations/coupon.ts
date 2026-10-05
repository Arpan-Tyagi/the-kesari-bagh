// Zod Validation Contracts for Promotional Coupons

import { z } from 'zod';

export const verifyCouponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  bookingSubtotal: z.number().positive('Booking subtotal must be greater than zero'),
});

export type VerifyCouponInput = z.infer<typeof verifyCouponSchema>;

export const adminCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Code must be at least 3 characters')
      .max(20, 'Code cannot exceed 20 characters')
      .toUpperCase(),
    discount_type: z.enum(['percentage', 'fixed']),
    discount_value: z.number().positive('Discount value must be greater than zero'),
    valid_from: z.string().min(1, 'Valid from date is required'),
    valid_until: z.string().min(1, 'Valid until date is required'),
    min_booking_amount: z.number().nonnegative().default(0),
    max_discount_amount: z.number().positive().optional(),
    usage_limit: z.number().int().positive().default(50),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => data.discount_type !== 'percentage' || data.discount_value <= 100,
    {
      message: 'Percentage discount cannot exceed 100%',
      path: ['discount_value'],
    }
  )
  .refine(
    (data) => new Date(data.valid_until) >= new Date(data.valid_from),
    {
      message: 'Valid until date must be on or after valid from date',
      path: ['valid_until'],
    }
  );

export type AdminCouponInput = z.infer<typeof adminCouponSchema>;
