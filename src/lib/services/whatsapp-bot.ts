// WhatsApp Conversational Booking Engine: Aarav, Senior AI Estate Concierge
import { EstateService } from './estate-service';
import { AUTHENTIC_ROOMS } from '../data/mock-estate-data';
import { WhatsAppDispatcher } from './whatsapp-dispatcher';
import { EmailDispatcher } from './email-dispatcher';
import { extractDatesAndGuests, extractGuestDetails } from './whatsapp-parser';
import { ESCALATION_MESSAGE, VOICE_FALLBACK_MESSAGE } from './whatsapp-prompts';

export enum WhatsAppState {
  STATE_0_IDLE = 0,
  STATE_1_DATE_OCCUPANCY = 1,
  STATE_2_ROOM_SELECTION = 2,
  STATE_3_GUEST_DETAILS = 3,
  STATE_4_PAYMENT_CONFIRM = 4,
}

export interface GuestSession {
  phone: string;
  state: WhatsAppState;
  checkIn?: string;
  checkOut?: string;
  guestsCount?: number;
  selectedRoomId?: string;
  guestName?: string;
  guestEmail?: string;
  idType?: string;
  pendingBookingRef?: string;
  lastInteraction: number;
}

const sessionStore = new Map<string, GuestSession>();

export class WhatsAppBookingEngine {
  static getSession(phone: string): GuestSession {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let session = sessionStore.get(cleanPhone);
    if (!session) {
      session = { phone: cleanPhone, state: WhatsAppState.STATE_0_IDLE, lastInteraction: Date.now() };
      sessionStore.set(cleanPhone, session);
    }
    return session;
  }

  static resetSession(phone: string): void {
    sessionStore.delete(phone.replace(/[^0-9]/g, ''));
  }

  static extractDatesAndGuests = extractDatesAndGuests;
  static extractGuestDetails = extractGuestDetails;

  static async handleIncomingMessage(params: {
    from: string;
    text?: string;
    messageType?: string;
  }): Promise<{ reply: string; session: GuestSession; escalated: boolean }> {
    const session = this.getSession(params.from);
    session.lastInteraction = Date.now();
    const text = (params.text || '').trim();

    if (params.messageType === 'audio' || params.messageType === 'voice') {
      return { reply: VOICE_FALLBACK_MESSAGE, session, escalated: false };
    }

    const lower = text.toLowerCase();
    const parsedProbe = extractDatesAndGuests(text);
    const exceedsCapacity = Boolean(parsedProbe.guests && parsedProbe.guests > 16);
    const escalationKeywords = ['wedding', 'corporate retreat', '>16', '16 guests', 'distress', 'human', 'manager', 'speak to someone', 'urgent', 'complaint'];

    if (exceedsCapacity || escalationKeywords.some((kw) => lower.includes(kw))) {
      return { reply: ESCALATION_MESSAGE, session, escalated: true };
    }

    if (lower.includes('change date') || lower.includes('different dates') || lower.includes('start over') || lower.includes('restart')) {
      session.state = WhatsAppState.STATE_1_DATE_OCCUPANCY;
      session.checkIn = undefined;
      session.checkOut = undefined;
      session.selectedRoomId = undefined;
      const reply = `🌿 *The Bagh Concierge*\n\nCertainly! Which check-in and check-out dates would you prefer, and how many guests?`;
      return { reply, session, escalated: false };
    }

    switch (session.state) {
      case WhatsAppState.STATE_0_IDLE: return this.handleState0(session, text);
      case WhatsAppState.STATE_1_DATE_OCCUPANCY: return this.handleState1(session, text);
      case WhatsAppState.STATE_2_ROOM_SELECTION: return this.handleState2(session, text);
      case WhatsAppState.STATE_3_GUEST_DETAILS: return this.handleState3(session, text);
      case WhatsAppState.STATE_4_PAYMENT_CONFIRM: return this.handleState4(session, text);
      default:
        session.state = WhatsAppState.STATE_0_IDLE;
        return this.handleState0(session, text);
    }
  }

  private static handleState0(session: GuestSession, text: string) {
    const lower = text.toLowerCase();
    const isBooking = lower.includes('book') || lower.includes('room') || lower.includes('suite') || lower.includes('stay') || lower.includes('available') || lower.includes('night') || lower.includes('weekend');
    if (isBooking) {
      const parsed = extractDatesAndGuests(text);
      if (parsed.guests) session.guestsCount = parsed.guests;
      if (parsed.checkIn && parsed.checkOut) {
        session.checkIn = parsed.checkIn;
        session.checkOut = parsed.checkOut;
        session.guestsCount = parsed.guests || session.guestsCount || 2;
        session.state = WhatsAppState.STATE_2_ROOM_SELECTION;
        return this.presentAvailableRooms(session);
      }
      session.state = WhatsAppState.STATE_1_DATE_OCCUPANCY;
      const reply = `🌿 *Welcome to The Bagh, Manesar*\n_French-Colonial Countryside Sanctuary_\n\nI am Aarav, your Senior AI Estate Concierge.\n\nPlease share:\n• *Check-in & Check-out dates* (e.g. *Nov 20 to Nov 22*)\n• *Number of guests*`;
      return { reply, session, escalated: false };
    }
    const reply = `⚜️ *THE BAGH, MANESAR* ⚜️\n_French-Colonial Countryside Retreat_\n\nGreetings! I am Aarav, your Senior Estate Concierge.\n\nThe Bagh holds just **4 authentic bedroom keys** across 1.25 manicured acres.\n\nHow may I assist you today?\n• Reply *BOOK* to reserve a private countryside suite\n• Inquire about *Dining under the French Chandelier*\n• Ask about meeting *Elly—Black Beauty* (Marwari horse) or *Paragliding*`;
    return { reply, session, escalated: false };
  }

  private static handleState1(session: GuestSession, text: string) {
    const parsed = extractDatesAndGuests(text);
    if (!parsed.checkIn || !parsed.checkOut) {
      const reply = `🌿 To verify suite availability, please specify both check-in and check-out dates (e.g., *Nov 20 to Nov 22* or *2026-11-20 to 2026-11-22*).`;
      return { reply, session, escalated: false };
    }
    session.checkIn = parsed.checkIn;
    session.checkOut = parsed.checkOut;
    session.guestsCount = parsed.guests || session.guestsCount || 2;
    session.state = WhatsAppState.STATE_2_ROOM_SELECTION;
    return this.presentAvailableRooms(session);
  }

  private static handleState2(session: GuestSession, text: string) {
    const lower = text.toLowerCase();
    const rooms = AUTHENTIC_ROOMS;
    let selected = rooms[0];
    if (lower.includes('1') || lower.includes('garden')) selected = rooms[0];
    else if (lower.includes('2') || lower.includes('aravalli')) selected = rooms[1];
    else if (lower.includes('3') || lower.includes('kitchen')) selected = rooms[2];
    else if (lower.includes('4') || lower.includes('lush') || lower.includes('green')) selected = rooms[3];

    session.selectedRoomId = selected.id;
    session.state = WhatsAppState.STATE_3_GUEST_DETAILS;
    const reply = `🛎️ *Selected: ${selected.name}*\n\nTo lock your suite and generate your reservation folio, please reply with:\n• *Full Name*\n• *Email Address*\n• *Government ID Type* (Passport / Aadhaar / Driver's License)`;
    return { reply, session, escalated: false };
  }

  private static handleState3(session: GuestSession, text: string) {
    const details = extractGuestDetails(text);
    session.guestName = details.name;
    session.guestEmail = details.email || `${session.phone}@guest.thebagh.com`;
    session.idType = details.idType || 'Government ID (On Arrival)';

    const lock = EstateService.createPendingReservation({
      roomId: session.selectedRoomId || 'room-1-garden-pool',
      checkIn: session.checkIn || '2026-11-20',
      checkOut: session.checkOut || '2026-11-22',
      guestsCount: session.guestsCount || 2,
      guestName: session.guestName || 'Valued Guest',
      guestEmail: session.guestEmail,
      guestPhone: session.phone,
      idType: session.idType,
      holdMinutes: 15,
    });

    const refCode = lock.booking?.reference_code || `TKB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    session.pendingBookingRef = refCode;
    session.state = WhatsAppState.STATE_4_PAYMENT_CONFIRM;
    const paymentUrl = lock.paymentUrl || `https://thebagh.com/checkout/pay?ref=${refCode}`;
    const reply = `🔒 *SUITE LOCKED FOR 15 MINUTES — 15-Minute Inventory Hold Confirmed*\n\n• *Folio Ref:* *${refCode}*\n• *Guest:* ${session.guestName} (${session.idType})\n• *Dates:* ${session.checkIn} to ${session.checkOut}\n\n💳 *Secure Payment Link:*\n${paymentUrl}\n\n_Reply *CONFIRM* to complete reservation now with pay-on-arrival._`;
    return { reply, session, escalated: false };
  }

  private static handleState4(session: GuestSession, text: string) {
    const lower = text.toLowerCase();
    const isConfirm = lower.includes('confirm') || lower.includes('arrival') || lower.includes('yes') || lower.includes('pay');
    if (isConfirm && session.pendingBookingRef) {
      const confirmed = EstateService.confirmBookingDirect(session.pendingBookingRef);
      session.state = WhatsAppState.STATE_0_IDLE;
      const refCode = confirmed?.booking?.reference_code || session.pendingBookingRef;
      const room = AUTHENTIC_ROOMS.find((r) => r.id === session.selectedRoomId) || AUTHENTIC_ROOMS[0];

      WhatsAppDispatcher.dispatchBookingNotification({
        phone: session.phone,
        guestName: session.guestName || 'Valued Guest',
        bookingReference: refCode,
        roomCategory: room.name,
        checkIn: session.checkIn || '2026-11-20',
        checkOut: session.checkOut || '2026-11-22',
        guestsCount: session.guestsCount || 2,
        amountPaid: confirmed?.booking?.total_price || 35400,
      });

      EmailDispatcher.dispatchBookingConfirmation({
        guestEmail: session.guestEmail || `${session.phone}@guest.thebagh.com`,
        guestName: session.guestName || 'Valued Guest',
        bookingReference: refCode,
        roomCategory: room.name,
        checkIn: session.checkIn || '2026-11-20',
        checkOut: session.checkOut || '2026-11-22',
        guestsCount: session.guestsCount || 2,
        amountPaid: confirmed?.booking?.total_price || 35400,
      });

      const reply = `✅ *RESERVATION CONFIRMED — THE BAGH* ⚜️\n\nDear ${session.guestName},\nYour private countryside sanctuary is reserved.\n\n• *Confirmation Code:* *${refCode}*\n• *Suite:* ${room.name}\n• *Check-in:* ${session.checkIn} (from 2:00 PM)\n• *Check-out:* ${session.checkOut} (by 11:00 AM)\n\n📍 *Estate Location:* Panchgaon-Mohamadpur Road, NH 8, Manesar\nhttps://maps.google.com/?q=28.3245,76.9018\n\nA confirmation receipt with an attached .ics calendar pass has been dispatched.`;
      return { reply, session, escalated: false };
    }
    const reply = `To finalize your reservation, reply *CONFIRM* or complete payment at: https://thebagh.com/checkout/pay?ref=${session.pendingBookingRef}`;
    return { reply, session, escalated: false };
  }

  private static presentAvailableRooms(session: GuestSession) {
    const checkIn = session.checkIn || '2026-11-20';
    const checkOut = session.checkOut || '2026-11-22';
    const available = AUTHENTIC_ROOMS.filter((r) => EstateService.checkAvailability(r.id, checkIn, checkOut));
    if (available.length === 0) {
      const reply = `🌿 All private suites are fully reserved for ${checkIn} to ${checkOut}. Would you like to check alternative dates?`;
      session.state = WhatsAppState.STATE_1_DATE_OCCUPANCY;
      return { reply, session, escalated: false };
    }
    const roomList = available.map((room, idx) => {
      const p = EstateService.calculatePricing(room, checkIn, checkOut);
      return `*${idx + 1}. ${room.name}*\n   • ${room.floor_level} Floor | ${room.square_meters} m² | ${room.view_type}\n   • Tariff: ₹${p.roomRatePerNight.toLocaleString('en-IN')}/night (Total ${p.nightsCount}N: ₹${p.finalPayableAmount.toLocaleString('en-IN')} incl. 18% GST)`;
    }).join('\n\n');
    const reply = `🌿 *Available Suites from ${checkIn} to ${checkOut}:*\n\n${roomList}\n\n_Reply with the number (e.g. *1*) or name of the suite you wish to reserve._`;
    return { reply, session, escalated: false };
  }
}
