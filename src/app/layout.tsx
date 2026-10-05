import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ConciergeChat } from '@/components/chat/ConciergeChat';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Kesari Bagh | French-Colonial Countryside Estate in Manesar',
  description:
    'An exclusive 4-key French-colonial countryside estate in the Aravalli foothills of Manesar, Gurugram. Ultra-luxury suites, equestrian experiences with Elly, French chandelier dining, and unhurried seclusion.',
  keywords: [
    'The Kesari Bagh',
    'Luxury resort Manesar',
    'French colonial retreat Gurugram',
    'Aravalli boutique hotel',
    'Private countryside estate Delhi NCR',
  ],
  openGraph: {
    title: 'The Kesari Bagh | French-Colonial Boutique Countryside Retreat',
    description:
      'Only 4 exclusive keys across 1.25 manicured acres facing the Aravallis. Discover timeless French refinement and authentic countryside solitude.',
    url: 'https://thekesaribagh.com',
    siteName: 'The Kesari Bagh',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F5] text-[#2B2D2B]">
        <SmoothScrollProvider>
          {children}
          <ConciergeChat />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
