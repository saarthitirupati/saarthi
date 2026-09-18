import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirumala & Tirupati Live Weather, Temperature & Pilgrimage Forecast',
  description: 'Current temperature, rainfall, fog visibility, and ghat road weather conditions for Tirumala Hill and Tirupati town. Clothing guidance for early morning darshans.',
  keywords: [
    'Tirumala weather today',
    'Tirumala temperature live',
    'Tirupati weather forecast',
    'Tirumala morning cold weather clothing tips',
    'Tirumala ghat road rain forecast',
    'తిరుమల వాతావరణం ఈరోజు',
  ],
  alternates: {
    canonical: `${baseUrl}/weather`,
  },
  openGraph: {
    title: 'Live Weather & Temperature in Tirumala & Tirupati | Saarthi Guide',
    description: 'Check real-time temperature, humidity, rainfall chances, and weather guidance for Tirumala hill and Tirupati.',
    url: `${baseUrl}/weather`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Tirumala & Tirupati Live Weather',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tirumala & Tirupati Live Weather & Temperature',
    description: 'Real-time temperature and weather conditions for pilgrims visiting Tirumala.',
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
