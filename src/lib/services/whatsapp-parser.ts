// WhatsApp Conversational NLP & Date/Entity Parser for The Bagh
export interface ParsedDatesAndGuests {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface ParsedGuestDetails {
  name?: string;
  email?: string;
  idType?: string;
  requests?: string;
}

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function formatYMD(d: Date): string {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
}

export function extractDatesAndGuests(text: string): ParsedDatesAndGuests {
  let checkIn: string | undefined;
  let checkOut: string | undefined;
  let guests: number | undefined;

  const adultsMatch = text.match(/(\d+)\s*(?:adults?|people|persons?|guests?|pax)/i);
  const childrenMatch = text.match(/(\d+)\s*child(?:ren)?/i);
  if (adultsMatch) {
    const adults = parseInt(adultsMatch[1], 10);
    const children = childrenMatch ? parseInt(childrenMatch[1], 10) : 0;
    guests = adults + children;
  } else {
    const forMatch = text.match(/for\s+(\d+)/i);
    if (forMatch) guests = parseInt(forMatch[1], 10);
  }

  // 1. ISO format
  const isoMatches = text.match(/\b\d{4}-\d{2}-\d{2}\b/g);
  if (isoMatches && isoMatches.length >= 2) {
    return { checkIn: isoMatches[0], checkOut: isoMatches[1], guests };
  }

  // 2. Next weekend
  if (text.toLowerCase().includes('next weekend') || text.toLowerCase().includes('this weekend')) {
    const now = new Date();
    const day = now.getDay();
    const daysUntilFriday = ((5 - day + 7) % 7) || 7;
    const fri = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilFriday);
    const sun = new Date(fri.getFullYear(), fri.getMonth(), fri.getDate() + 2);
    return { checkIn: formatYMD(fri), checkOut: formatYMD(sun), guests };
  }

  // 3. Month First (e.g. Nov 20 to Nov 22)
  const monthFirstRegex = /\b(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?\s*(?:to|-|until|through)\s*(?:(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+)?(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?\b/i;
  const m1 = text.match(monthFirstRegex);
  if (m1) {
    const mStart = MONTH_MAP[m1[1].toLowerCase()];
    const dStart = parseInt(m1[2], 10);
    const yStart = m1[3] ? parseInt(m1[3], 10) : new Date().getFullYear();
    const mEnd = m1[4] ? MONTH_MAP[m1[4].toLowerCase()] : mStart;
    const dEnd = parseInt(m1[5], 10);
    const yEnd = m1[6] ? parseInt(m1[6], 10) : yStart;
    const startDate = new Date(yStart, mStart, dStart);
    const endDate = new Date(yEnd, mEnd, dEnd);
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate > startDate) {
      return { checkIn: formatYMD(startDate), checkOut: formatYMD(endDate), guests };
    }
  }

  // 4. Day First (e.g. 20 Nov to 22 Nov)
  const dayFirstRegex = /\b(\d{1,2})(?:st|nd|rd|th)?(?:\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december))?(?:\s*,?\s*(\d{4}))?\s*(?:to|-|until|through)\s*(\d{1,2})(?:st|nd|rd|th)?\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)(?:\s*,?\s*(\d{4}))?\b/i;
  const m2 = text.match(dayFirstRegex);
  if (m2) {
    const mEnd = MONTH_MAP[m2[5].toLowerCase()];
    const mStart = m2[2] ? MONTH_MAP[m2[2].toLowerCase()] : mEnd;
    const dStart = parseInt(m2[1], 10);
    const yStart = m2[3] ? parseInt(m2[3], 10) : new Date().getFullYear();
    const dEnd = parseInt(m2[4], 10);
    const yEnd = m2[6] ? parseInt(m2[6], 10) : yStart;
    const startDate = new Date(yStart, mStart, dStart);
    const endDate = new Date(yEnd, mEnd, dEnd);
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate > startDate) {
      return { checkIn: formatYMD(startDate), checkOut: formatYMD(endDate), guests };
    }
  }

  // 5. Slash/Dash format DD/MM/YYYY
  const slashRegex = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\s*(?:to|-|until)\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/;
  const m3 = text.match(slashRegex);
  if (m3) {
    const startDate = new Date(parseInt(m3[3], 10), parseInt(m3[2], 10) - 1, parseInt(m3[1], 10));
    const endDate = new Date(parseInt(m3[6], 10), parseInt(m3[5], 10) - 1, parseInt(m3[4], 10));
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate > startDate) {
      return { checkIn: formatYMD(startDate), checkOut: formatYMD(endDate), guests };
    }
  }

  return { checkIn, checkOut, guests };
}

export function extractGuestDetails(text: string): ParsedGuestDetails {
  let email: string | undefined;
  let name: string | undefined;
  let idType: string | undefined;

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  const idLabelMatch = text.match(/(?:id\s*(?:type)?|govt\s*id|identification|proof)[:\s]+([a-zA-Z0-9\s-]+?)(?:,|$|\n|\s+(?:email|name|phone))/i);
  if (idLabelMatch) {
    idType = idLabelMatch[1].trim();
  } else {
    const idKeywords = ['passport', 'aadhaar', 'driving license', 'voter id', 'pan card'];
    for (const kw of idKeywords) {
      if (text.toLowerCase().includes(kw)) {
        idType = kw.charAt(0).toUpperCase() + kw.slice(1);
        break;
      }
    }
  }

  const nameLabelMatch = text.match(/(?:name|guest)[:\s]+([a-zA-Z\s]{2,40})/i);
  if (nameLabelMatch) {
    let rawName = nameLabelMatch[1].trim();
    if (rawName.toLowerCase().startsWith('is ')) rawName = rawName.slice(3).trim();
    name = rawName.replace(/(?:email|phone|id|requests?).*$/i, '').trim();
  } else {
    const parts = text.split(/,|\n/);
    for (const part of parts) {
      let cleaned = part.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, '').trim();
      if (cleaned.length >= 2 && !cleaned.includes(':') && !cleaned.includes('@')) {
        if (cleaned.toLowerCase().startsWith('my name is ')) cleaned = cleaned.slice(11).trim();
        else if (cleaned.toLowerCase().startsWith('i am ')) cleaned = cleaned.slice(5).trim();
        if (cleaned.length >= 2) {
          name = cleaned;
          break;
        }
      }
    }
  }

  return { name: name || 'Valued Guest', email, idType, requests: text };
}
