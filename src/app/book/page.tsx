import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingFunnel } from '@/components/booking/BookingFunnel';

interface BookPageProps {
  searchParams: Promise<{
    roomId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export const metadata = {
  title: 'Reserve Your Suite | The Kesari Bagh French-Colonial Countryside Estate',
  description:
    'Secure your private retreat at The Kesari Bagh in Manesar. Transparent pricing, instant privilege coupons, and verified availability for 4 exclusive keys.',
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;

  const initialRoomId = params.roomId;
  const initialCheckIn = params.checkIn;
  const initialCheckOut = params.checkOut;
  const initialGuests = params.guests ? parseInt(params.guests, 10) : 2;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
            Bespoke Countryside Reservation
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#142019] mt-2 font-light">
            Reserve Your Estate Suite
          </h1>
        </div>

        <BookingFunnel
          initialRoomId={initialRoomId}
          initialCheckIn={initialCheckIn}
          initialCheckOut={initialCheckOut}
          initialGuests={initialGuests}
        />
      </main>
      <Footer />
    </div>
  );
}
