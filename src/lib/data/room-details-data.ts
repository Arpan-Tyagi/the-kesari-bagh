// Aggregate Architectural & Brand Specifications for The Kesari Bagh Suites
import { RoomDetailSpec } from '@/types/room-details';
import { GROUND_FLOOR_SPECS } from './room-specs-ground';
import { FIRST_FLOOR_SPECS } from './room-specs-first';

export type { RoomDetailSpec } from '@/types/room-details';

export const ROOM_DETAILED_SPECS: Record<string, RoomDetailSpec> = {
  ...GROUND_FLOOR_SPECS,
  ...FIRST_FLOOR_SPECS,
};

export function getRoomDetailBySlug(slug: string): RoomDetailSpec | undefined {
  return ROOM_DETAILED_SPECS[slug];
}
