// Meta WhatsApp Cloud API v19.0 Dispatcher for The Kesari Bagh
// Sends structured reservation confirmations, Google Maps links, and concierge alerts

import { BookingEntity } from '@/types/database';

export interface WhatsAppDispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface DispatchedWhatsAppMessage {
  recipient: string;
  body: string;
  timestamp: string;
  messageId: string;
}

export class WhatsAppDispatcher {
  private static apiVersion = 'v19.0';
  private static phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || 'demo_phone_id';
  private static accessToken = process.env.WHATSAPP_ACCESS_TOKEN || 'demo_token';
  private static dispatchHistory: DispatchedWhatsAppMessage[] = [];

  static getDispatchedHistory(): DispatchedWhatsAppMessage[] {
    return this.dispatchHistory;
  }

  static clearHistory(): void {
    this.dispatchHistory = [];
  }

  static async sendTextMessage(
    toPhone: string,
    messageText: string
  ): Promise<WhatsAppDispatchResult> {
    const recipientPhone = toPhone.replace(/[^0-9]/g, '');
    const messageId = `mock_wam_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    this.dispatchHistory.push({
      recipient: recipientPhone,
      body: messageText,
      timestamp: new Date().toISOString(),
      messageId,
    });

    if (!process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN === 'demo_token') {
      console.log(`[WhatsApp Mock Dispatcher] Message dispatched to ${recipientPhone}:\n${messageText}`);
      return { success: true, messageId };
    }

    try {
      const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'text',
          text: {
            preview_url: true,
            body: messageText,
          },
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        console.error('[WhatsApp Cloud API Error]:', errJson);
        return { success: false, error: JSON.stringify(errJson) };
      }

      const resData = await response.json();
      return { success: true, messageId: resData.messages?.[0]?.id || messageId };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown network failure';
      console.error('[WhatsApp Dispatch Exception]:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  static async sendBookingConfirmation(
    booking: BookingEntity,
    roomName: string
  ): Promise<WhatsAppDispatchResult> {
    const mapsLink = 'https://maps.google.com/?q=28.3245,76.9018';
    const recipientPhone = booking.guest_phone.replace(/[^0-9]/g, '');

    const messageBody = 
`⚜️ *THE KESARI BAGH* ⚜️
_French-Colonial Countryside Retreat_

Dear ${booking.guest_name},

Your exclusive countryside reservation has been confirmed.

• *Reservation ID:* ${booking.reference_code}
• *Suite:* ${roomName}
• *Check-in:* ${booking.check_in} (from 2:00 PM)
• *Check-out:* ${booking.check_out} (by 11:00 AM)
• *Guests:* ${booking.guests_count} adults
• *Total Tariff:* ₹${booking.total_price.toLocaleString('en-IN')}

📍 *Estate Directions (NH 8, Manesar):*
${mapsLink}

Our estate concierge is at your service. For custom dining or equestrian experiences with Elly, reply directly to this message.

_Warm Regards,_
*Estate Management, The Kesari Bagh*`;

    return this.sendTextMessage(recipientPhone, messageBody);
  }

  static async dispatchBookingNotification(params: {
    phone: string;
    guestName: string;
    bookingReference: string;
    roomCategory: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    amountPaid: number;
  }): Promise<WhatsAppDispatchResult> {
    const mockBooking: Partial<BookingEntity> = {
      guest_phone: params.phone,
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
