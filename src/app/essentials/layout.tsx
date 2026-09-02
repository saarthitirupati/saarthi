import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirumala Darshan Essentials: Free SSD Tokens, Luggage Lockers & Ghat Road Rules',
  description: 'Complete guide for Tirumala pilgrims: Official TTD Free SSD token counter locations, timings, luggage & mobile phone lockers, and 28-minute Ghat Road speed rules.',
  keywords: [
    'Tirupati SSD tokens counters',
    'Free darshan tokens Tirupati timings',
    'Tirumala luggage lockers',
    'Tirumala mobile phone deposit counters',
    'Tirumala ghat road timings',
    'Tirumala ghat road speed limit fine',
    'Bhudevi complex SSD tokens',
    'Srinivasam complex tokens',
    'తిరుపతి ఉచిత దర్శనం టోకెన్లు',
    'తిరుమల ఘాట్ రోడ్ సమయాలు',
  ],
  alternates: {
    canonical: `${baseUrl}/essentials`,
  },
  openGraph: {
    title: 'Tirumala Darshan Essentials & Logistics Guide | Saarthi Guide',
    description: 'Verified locations for free SSD token counters, luggage lockers, footwear stands, and ghat road transit rules for Tirupati & Tirumala.',
    url: `${baseUrl}/essentials`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Tirumala Essentials - Saarthi Guide',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tirumala Darshan Essentials & Logistics Guide | Saarthi Guide',
    description: 'Verified free SSD token counters, luggage lockers, and ghat road transit guidelines.',
    images: [`${baseUrl}/logo.png`],
  },
};

export default function EssentialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
