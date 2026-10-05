import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { EstateHeritage } from '@/components/home/EstateHeritage';
import { RoomsShowcase } from '@/components/home/RoomsShowcase';
import { DiningSection } from '@/components/home/DiningSection';
import { ExperiencesSection } from '@/components/home/ExperiencesSection';
import { EstateAmenities } from '@/components/home/EstateAmenities';
import { EventsInquirySection } from '@/components/home/EventsInquirySection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] selection:bg-[#C5A880] selection:text-[#142019]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <EstateHeritage />
        <RoomsShowcase />
        <DiningSection />
        <ExperiencesSection />
        <EstateAmenities />
        <EventsInquirySection />
      </main>
      <Footer />
    </div>
  );
}
