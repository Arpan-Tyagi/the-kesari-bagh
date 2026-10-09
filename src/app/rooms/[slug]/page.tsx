// Dynamic Ultra-Luxury Room Showcase Page for The Kesari Bagh
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EstateService } from '@/lib/services/estate-service';
import { getRoomDetailBySlug } from '@/lib/data/room-details-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoomHero } from '@/components/room/RoomHero';
import { RoomNarrative } from '@/components/room/RoomNarrative';
import { RoomSpecsBento } from '@/components/room/RoomSpecsBento';
import { RoomGallery } from '@/components/room/RoomGallery';
import { RoomAmenities } from '@/components/room/RoomAmenities';
import { RoomBookingCard } from '@/components/room/RoomBookingCard';
import { RoomPolicies } from '@/components/room/RoomPolicies';
import { RoomOtherSuites } from '@/components/room/RoomOtherSuites';

interface RoomPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const rooms = EstateService.getRooms();
  return rooms.map((room) => ({
    slug: room.slug,
  }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = EstateService.getRoomBySlug(slug);
  const detail = getRoomDetailBySlug(slug);

  if (!room || !detail) {
    return {
      title: 'Suite Not Found | The Kesari Bagh',
    };
  }

  return {
    title: `${room.name} (${detail.keyNumber.split('•')[0].trim()}) | The Kesari Bagh`,
    description: `${room.description} ${detail.tagline}. Located in Manesar, Gurugram.`,
    openGraph: {
      title: `${room.name} | The Kesari Bagh French-Colonial Estate`,
      description: room.short_description,
      images: [
        {
          url: room.images[0],
          width: 1200,
          height: 630,
          alt: room.name,
        },
      ],
    },
  };
}

export default async function RoomDetailPage({ params }: RoomPageProps) {
  const { slug } = await params;
  const room = EstateService.getRoomBySlug(slug);
  const detail = getRoomDetailBySlug(slug);
  const allRooms = EstateService.getRooms();

  if (!room || !detail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2B2D2B] selection:bg-[#C5A880]/30 selection:text-[#142019]">
      {/* Global Luxury Navigation */}
      <Navbar />

      {/* Hero Showcase */}
      <RoomHero room={room} detail={detail} />

      {/* Main Architectural Content & Sticky Booking Console */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Story & Blueprints (8 Columns) */}
          <div className="lg:col-span-8 space-y-20">
            {/* Curatorial Essay & Textures */}
            <RoomNarrative room={room} detail={detail} />

            {/* Spatial Dimensions & Blueprint Bento */}
            <RoomSpecsBento room={room} detail={detail} />

            {/* High-Resolution Interactive Gallery */}
            <RoomGallery detail={detail} roomName={room.name} />

            {/* Artisanal In-Room Appointments */}
            <RoomAmenities detail={detail} />

            {/* Estate Policies & Sanctuary Etiquette */}
            <RoomPolicies />

            {/* Cross-Exploration of Other Suites */}
            <RoomOtherSuites currentRoomSlug={room.slug} allRooms={allRooms} />
          </div>

          {/* Sticky Reservation & Concierge Console (4 Columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <RoomBookingCard room={room} detail={detail} />
          </div>
        </div>
      </main>

      {/* Global Estate Footer */}
      <Footer />
    </div>
  );
}
