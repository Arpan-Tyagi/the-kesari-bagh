// Resend Transactional Email Dispatcher for The Kesari Bagh
// Sends bespoke French-colonial aesthetic confirmation emails

import { Resend } from 'resend';
import { BookingEntity } from '@/types/database';

export interface EmailDispatchResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

export interface DispatchedEmailRecord {
  to: string;
  from: string;
  subject: string;
  referenceCode: string;
  hasIcsAttachment: boolean;
  icsContent: string;
  itemizedTotal: number;
  emailId: string;
  timestamp: string;
}

export function generateIcsCalendar(booking: BookingEntity, roomName: string): string {
  const startStr = booking.check_in.replace(/-/g, '') + 'T140000';
  const endStr = booking.check_out.replace(/-/g, '') + 'T110000';
  const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Bagh//Estate Reservation Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:reservation-${booking.reference_code}@thebagh.com`,
    `DTSTAMP:${nowStr}`,
    `DTSTART;TZID=Asia/Kolkata:${startStr}`,
    `DTEND;TZID=Asia/Kolkata:${endStr}`,
    `SUMMARY:Confirmed Stay at The Bagh - ${roomName} (${booking.reference_code})`,
    `DESCRIPTION:Your exclusive countryside reservation at The Bagh is confirmed.\\nReference Code: ${booking.reference_code}\\nSuite: ${roomName}\\nCheck-in: 2:00 PM\\nCheck-out: 11:00 AM\\nEstate Contact: +91 98108 11233`,
    'LOCATION:The Bagh\\, Panchgaon-Mohamadpur Road\\, NH 8\\, Village Para\\, Manesar\\, Gurugram\\, Haryana 122105',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export class EmailDispatcher {
  private static apiKey = process.env.RESEND_API_KEY || 're_demo_key';
  private static dispatchHistory: DispatchedEmailRecord[] = [];

  static getDispatchedHistory(): DispatchedEmailRecord[] {
    return this.dispatchHistory;
  }

  static clearHistory(): void {
    this.dispatchHistory = [];
  }

  static async sendBookingConfirmation(
    booking: BookingEntity,
    roomName: string
  ): Promise<EmailDispatchResult> {
    const formattedPrice = `₹${booking.total_price.toLocaleString('en-IN')}`;
    const baseSubtotal = (booking.room_rate_per_night * booking.nights_count).toLocaleString('en-IN');
    const addonsTotal = (booking.addons_total || 0).toLocaleString('en-IN');
    const discountTotal = (booking.discount_total || 0).toLocaleString('en-IN');
    const taxTotal = (booking.tax_total || 0).toLocaleString('en-IN');
    const icsContent = generateIcsCalendar(booking, roomName);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #FBF9F5; color: #2B2D2B; margin: 0; padding: 40px 20px; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #E0CDB7; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    .header { text-align: center; border-bottom: 2px solid #E0CDB7; padding-bottom: 24px; margin-bottom: 24px; }
    .title { font-size: 26px; letter-spacing: 2px; color: #142019; margin: 0 0 8px 0; }
    .subtitle { font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: #C5A880; }
    .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #142019; border-bottom: 1px solid #E0CDB7; padding-bottom: 6px; margin: 24px 0 12px 0; font-weight: bold; }
    .details { width: 100%; border-collapse: collapse; margin: 12px 0; }
    .details td { padding: 8px 0; border-bottom: 1px dashed #F0EBE1; font-size: 14px; }
    .label { color: #5F635F; }
    .val { text-align: right; font-weight: bold; color: #142019; }
    .invoice { width: 100%; border-collapse: collapse; margin: 12px 0; background: #FAF8F5; }
    .invoice th { text-align: left; padding: 8px; font-size: 12px; text-transform: uppercase; color: #5F635F; border-bottom: 1px solid #E0CDB7; }
    .invoice td { padding: 8px; font-size: 13px; border-bottom: 1px solid #EFEAE2; }
    .invoice .total-row td { font-weight: bold; font-size: 15px; color: #142019; border-top: 2px solid #E0CDB7; }
    .instructions { background: #F4F1EA; padding: 16px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #3A3D3A; margin: 20px 0; }
    .footer { text-align: center; font-size: 12px; color: #8E928E; margin-top: 32px; border-top: 1px solid #F0EBE1; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">THE BAGH</h1>
      <div class="subtitle">French-Colonial Countryside Retreat • Manesar</div>
    </div>
    <p>Dear ${booking.guest_name},</p>
    <p>We are delighted to confirm your upcoming countryside reservation at The Bagh in Manesar, Gurugram.</p>
    
    <div class="section-title">Reservation Summary</div>
    <table class="details">
      <tr><td class="label">Reservation Code</td><td class="val">${booking.reference_code}</td></tr>
      <tr><td class="label">Suite Category</td><td class="val">${roomName}</td></tr>
      <tr><td class="label">Check-in Date</td><td class="val">${booking.check_in} (from 2:00 PM)</td></tr>
      <tr><td class="label">Check-out Date</td><td class="val">${booking.check_out} (by 11:00 AM)</td></tr>
      <tr><td class="label">Stay Duration</td><td class="val">${booking.nights_count} Night(s)</td></tr>
      <tr><td class="label">Occupancy</td><td class="val">${booking.guests_count} Guests</td></tr>
    </table>

    <div class="section-title">Itemized Invoice &amp; Tax Statement</div>
    <table class="invoice">
      <thead>
        <tr><th>Particulars</th><th style="text-align: right;">Amount (INR)</th></tr>
      </thead>
      <tbody>
        <tr><td>Base Suite Tariff (${booking.nights_count} nights)</td><td style="text-align: right;">₹${baseSubtotal}</td></tr>
        <tr><td>Curated Estate Add-ons</td><td style="text-align: right;">₹${addonsTotal}</td></tr>
        <tr><td>Promotional Privilege Discount</td><td style="text-align: right;">-₹${discountTotal}</td></tr>
        <tr><td>Hospitality GST (18%)</td><td style="text-align: right;">₹${taxTotal}</td></tr>
        <tr class="total-row"><td>Total Amount Paid</td><td style="text-align: right;">${formattedPrice}</td></tr>
      </tbody>
    </table>

    <div class="section-title">Arrival &amp; Check-In Instructions</div>
    <div class="instructions">
      <p><strong>📍 Estate Directions:</strong> From Delhi IGI Airport (DEL), proceed south on NH 8 towards Manesar (approx. 45 km / 1 hour). Take the exit onto Panchgaon-Mohamadpur Road; The Bagh is situated in Village Para directly behind Best Western Resort Country Club.</p>
      <p><strong>⏰ Check-in &amp; Check-out:</strong> Suite access commences at 2:00 PM. Check-out is scheduled by 11:00 AM.</p>
      <p><strong>🌿 House Rules:</strong> The estate is a strictly pet-free, non-smoking sanctuary (smoking permitted exclusively in designated outdoor garden zones).</p>
      <p><strong>📅 Calendar Invitation:</strong> Your <code>.ics</code> calendar file is attached to sync with Apple Calendar, Outlook, and Google Calendar.</p>
    </div>

    <div class="footer">
      The Bagh • Panchgaon-Mohamadpur Road, NH 8, Manesar, Gurugram, Haryana 122105<br>
      Estate Concierge: reservations@thebagh.com | WhatsApp: +91 98108 11233
    </div>
  </div>
</body>
</html>
`;

    const emailId = `mock_email_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const sender = 'The Bagh <reservations@thebagh.com>';

    this.dispatchHistory.push({
      to: booking.guest_email,
      from: sender,
      subject: `Reservation Confirmed: ${booking.reference_code} - The Bagh`,
      referenceCode: booking.reference_code,
      hasIcsAttachment: true,
      icsContent,
      itemizedTotal: booking.total_price,
      emailId,
      timestamp: new Date().toISOString(),
    });

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_demo_key') {
      console.log(`[Resend Mock Dispatcher] Confirmation email with .ics attachment sent to ${booking.guest_email} for ${booking.reference_code}`);
      return { success: true, emailId };
    }

    try {
      const resend = new Resend(this.apiKey);
      const data = await resend.emails.send({
        from: sender,
        to: [booking.guest_email],
        subject: `Reservation Confirmed: ${booking.reference_code} - The Bagh`,
        html: htmlContent,
        attachments: [
          {
            filename: `reservation-${booking.reference_code}.ics`,
            content: Buffer.from(icsContent).toString('base64'),
          },
        ],
        headers: {
          'X-Entity-Ref-ID': booking.reference_code,
        },
      });

      return { success: true, emailId: data.data?.id || emailId };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown Resend error';
      console.error('[Resend Dispatch Exception]:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  static async dispatchBookingConfirmation(params: {
    guestEmail: string;
    guestName: string;
    bookingReference: string;
    roomCategory: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    amountPaid: number;
  }): Promise<EmailDispatchResult> {
    const mockBooking: Partial<BookingEntity> = {
      guest_email: params.guestEmail,
      guest_name: params.guestName,
      reference_code: params.bookingReference,
      check_in: params.checkIn,
      check_out: params.checkOut,
      guests_count: params.guestsCount,
      total_price: params.amountPaid,
    };
    return this.sendBookingConfirmation(mockBooking as BookingEntity, params.roomCategory);
  }
}
