import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Explore 74+ Temples & Sacred Shrines in Tirupati & Tirumala',
  description: 'Search and discover all 74+ temples, sacred theerthams, and heritage spots across Tirumala and Tirupati. Offline precinct maps, darshan timings, dress codes, and walking routes.',
  keywords: [
    'Tirupati temples list',
    'Tirumala sacred spots',
    'Tirupati sightseeing places',
    'Kapila Theertham',
    'Srinivasa Mangapuram',
    'Tiruchanur Padmavathi Temple',
    'Srivari Padalu Tirumala',
    'Tirupati temple timings guide',
    'తిరుపతి ఆలయాల జాబితా',
    'తిరుమల దర్శనీయ స్థలాలు',
  ],
  alternates: {
    canonical: `${baseUrl}/explore`,
  },
  openGraph: {
    title: 'Explore 74+ Temples in Tirupati & Tirumala | Saarthi Guide',
    description: 'Comprehensive directory of 74+ shrines, waterfalls, and sacred theerthams in Tirupati & Tirumala with 100% offline precinct maps and darshan timings.',
    url: `${baseUrl}/explore`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Explore Tirupati Temples & Heritage with Saarthi',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore 74+ Temples in Tirupati & Tirumala | Saarthi Guide',
    description: 'Search 74+ temples, darshan timings, and offline precinct maps across Tirupati & Tirumala.',
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
