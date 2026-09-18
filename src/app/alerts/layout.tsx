import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Live Tirumala Darshan Wait Times & Free SSD Token Counter Status',
  description: 'Live TTD Darshan queue updates today: Sarva Darshan waiting hours, compartment crowd density, and free SSD token counter statuses at Srinivasam, Bhudevi, and Vishnu Nivasam.',
  keywords: [
    'Tirumala darshan wait time today live',
    'TTD SSD token status today',
    'Free darshan token counter status Tirupati',
    'Tirumala queue compartments waiting hours',
    'Sarva darshan waiting time today',
    'Bhudevi complex token counter status',
    'Srinivasam complex token availability',
    'తిరుమల దర్శనం వేచి ఉండే సమయం',
    'ఉచిత ఎస్ఎస్డీ టోకెన్ల తాజా సమాచారం',
  ],
  alternates: {
    canonical: `${baseUrl}/alerts`,
  },
  openGraph: {
    title: 'Live Tirumala Darshan Wait Times & SSD Token Counters | Saarthi Guide',
    description: 'Real-time TTD queue status, compartment wait times, and free SSD token counter availability across Tirupati.',
    url: `${baseUrl}/alerts`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Live Tirumala Darshan & SSD Token Alerts',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Tirumala Darshan Wait Times & SSD Token Counters',
    description: 'Instant live queue wait times and SSD token counter statuses for Tirumala pilgrims.',
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
