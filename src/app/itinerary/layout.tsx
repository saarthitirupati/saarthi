import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirupati & Tirumala Pilgrimage Itineraries: 1-Day, 2-Day & 3-Day Plans',
  description: 'Handcrafted pilgrimage itineraries for Tirupati and Tirumala: Optimized step-by-step schedules for families, senior citizens, and first-time pilgrims.',
  keywords: [
    'Tirupati 1 day itinerary',
    'Tirumala 2 days trip plan',
    'Tirupati weekend temple tour',
    'Tirupati itinerary for senior citizens',
    'తిరుపతి యాత్రా ప్రణాళిక',
  ],
  alternates: {
    canonical: `${baseUrl}/itinerary`,
  },
  openGraph: {
    title: 'Tirupati & Tirumala Pilgrimage Itineraries | Saarthi Guide',
    description: 'Custom 1-day, 2-day, and weekend temple itineraries for Tirupati and Tirumala.',
    url: `${baseUrl}/itinerary`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Tirupati Pilgrimage Itinerary Planner',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tirupati & Tirumala Pilgrimage Itineraries',
    description: 'Tailored 1-day, 2-day, and 3-day pilgrimage itineraries for Tirupati and Tirumala.',
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
