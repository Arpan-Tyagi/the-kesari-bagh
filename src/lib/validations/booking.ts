// Zod Validation Contracts for Booking Funnel and Room Reservations

import { z } from 'zod';

export const bookingFormSchema = z
  .object({
    roomId: z.string().min(1, 'Please select a room suite'),
    checkIn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid check-in date required (YYYY-MM-DD)'),
    checkOut: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid check-out date required (YYYY-MM-DD)'),
    guestsCount: z
      .number()
      .int()
      .min(1, 'At least 1 guest is required')
      .max(4, 'Maximum 4 guests permitted per suite'),
    addonIds: z.array(z.string()).default([]),
    couponCode: z.string().optional(),
    guestName: z
      .string()
      .min(2, 'Full name must have at least 2 characters')
      .max(80, 'Full name cannot exceed 80 characters'),
    guestEmail: z
      .string()
      .email('Please provide a valid email address for confirmation dispatches'),
    guestPhone: z
      .string()
      .regex(
        /^[+]?[0-9\s-]{10,15}$/,
        'Please enter a valid phone number (10-15 digits) for WhatsApp concierge notifications'
      ),
    specialRequests: z.string().max(500, 'Special requests cannot exceed 500 characters').optional(),
  })
  .refine(
    (data) => {
      const inDate = new Date(data.checkIn);
      const outDate = new Date(data.checkOut);
      return outDate > inDate;
    },
    {
      message: 'Check-out date must occur after check-in date',
      path: ['checkOut'],
    }
  );

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const dateAvailabilitySchema = z
  .object({
    roomId: z.string().min(1, 'Room ID is required'),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-in date required'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-out date required'),
  })
  .refine(
    (data) => {
      const inDate = new Date(data.checkIn);
      const outDate = new Date(data.checkOut);
      return outDate > inDate;
    },
    {
      message: 'Check-out date must follow check-in date',
      path: ['checkOut'],
    }
  );

export type DateAvailabilityQuery = z.infer<typeof dateAvailabilitySchema>;
