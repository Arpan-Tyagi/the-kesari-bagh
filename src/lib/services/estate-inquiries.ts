// Estate Inquiries Layer: Weddings, Corporate Retreats & Shoots
import { EventInquiryEntity, InquiryStatus, EventType } from '@/types/database';

const memoryInquiries: EventInquiryEntity[] = [
  {
    id: 'inq-demo-1',
    name: 'Radhika Mehra',
    email: 'radhika@mehra.in',
    phone: '+919811122334',
    event_type: 'intimate_wedding',
    guest_count: 24,
    preferred_date: '2026-12-15',
    message: 'Indoor French crystal chandelier dining & lawn reception for family gathering.',
    status: 'new',
    created_at: new Date().toISOString(),
  },
];

export class EstateInquiryService {
  static getInquiries(): EventInquiryEntity[] {
    return memoryInquiries;
  }

  static createEventInquiry(data: {
    name: string;
    email: string;
    phone: string;
    eventType: EventType;
    guestCount: number;
    preferredDate: string;
    message: string;
  }): EventInquiryEntity {
    const inquiry: EventInquiryEntity = {
      id: `inq-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      event_type: data.eventType,
      guest_count: data.guestCount,
      preferred_date: data.preferredDate,
      message: data.message,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    memoryInquiries.unshift(inquiry);
    return inquiry;
  }

  static updateInquiryStatus(id: string, status: InquiryStatus): boolean {
    const inquiry = memoryInquiries.find((i) => i.id === id);
    if (!inquiry) return false;
    inquiry.status = status;
    return true;
  }
}
