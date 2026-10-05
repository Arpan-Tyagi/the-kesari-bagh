// Resend Transactional Email Dispatcher for The Kesari Bagh
// Sends bespoke French-colonial aesthetic confirmation emails

import { Resend } from 'resend';
import { BookingEntity } from '@/types/database';

export interface EmailDispatchResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

export class EmailDispatcher {
  private static apiKey = process.env.RESEND_API_KEY || 're_demo_key';

  static async sendBookingConfirmation(
    booking: BookingEntity,
    roomName: string
  ): Promise<EmailDispatchResult> {
    const formattedPrice = `₹${booking.total_price.toLocaleString('en-IN')}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #FBF9F5; color: #2B2D2B; margin: 0; padding: 40px 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E0CDB7; padding: 40px; }
    .header { text-align: center; border-bottom: 1px solid #E0CDB7; padding-bottom: 24px; margin-bottom: 24px; }
    .title { font-size: 26px; letter-spacing: 2px; color: #142019; margin: 0 0 8px 0; }
    .subtitle { font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: #C5A880; }
    .details { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .details td { padding: 10px 0; border-bottom: 1px dashed #F0EBE1; font-size: 15px; }
    .label { color: #5F635F; }
    .val { text-align: right; font-weight: bold; color: #142019; }
    .footer { text-align: center; font-size: 12px; color: #8E928E; margin-top: 32px; border-top: 1px solid #F0EBE1; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">THE KESARI BAGH</h1>
      <div class="subtitle">Boutique French-Colonial Countryside Estate</div>
    </div>
    <p>Dear ${booking.guest_name},</p>
    <p>We are delighted to confirm your upcoming countryside retreat at The Kesari Bagh in Manesar.</p>
    
    <table class="details">
      <tr><td class="label">Reservation Code</td><td class="val">${booking.reference_code}</td></tr>
      <tr><td class="label">Suite</td><td class="val">${roomName}</td></tr>
      <tr><td class="label">Check-in Date</td><td class="val">${booking.check_in} (from 2:00 PM)</td></tr>
      <tr><td class="label">Check-out Date</td><td class="val">${booking.check_out} (by 11:00 AM)</td></tr>
      <tr><td class="label">Nights Reserved</td><td class="val">${booking.nights_count} Night(s)</td></tr>
      <tr><td class="label">Guests</td><td class="val">${booking.guests_count} Guests</td></tr>
      <tr><td class="label">Total Tariff (incl. GST)</td><td class="val">${formattedPrice}</td></tr>
    </table>

    <p style="font-size: 14px; line-height: 1.6; color: #5F635F;">
      <strong>Estate Policies:</strong> Standard check-in begins at 2:00 PM. The estate operates as a strictly non-smoking, pet-free countryside sanctuary to protect local heritage and equestrian flora.
    </p>

    <div class="footer">
      The Kesari Bagh • Panchgaon-Mohamadpur Road, NH 8, Manesar, Gurugram 122105<br>
      Estate Concierge: concierge@thekesaribagh.com | +91 98100 00000
    </div>
  </div>
</body>
</html>
`;

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_demo_key') {
      console.log(`[Resend Mock Dispatcher] Confirmation email sent to ${booking.guest_email} for ${booking.reference_code}`);
      return { success: true, emailId: `mock_email_${Date.now()}` };
    }

    try {
      const resend = new Resend(this.apiKey);
      const data = await resend.emails.send({
        from: 'The Kesari Bagh <reservations@thekesaribagh.com>',
        to: [booking.guest_email],
        subject: `Reservation Confirmed: ${booking.reference_code} - The Kesari Bagh`,
        html: htmlContent,
      });

      return { success: true, emailId: data.data?.id };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown Resend error';
      console.error('[Resend Dispatch Exception]:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }
}
