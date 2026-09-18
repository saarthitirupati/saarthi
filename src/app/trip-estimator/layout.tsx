import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirupati & Tirumala Trip Cost & Pilgrimage Budget Estimator',
  description: 'Plan and calculate your complete Tirupati & Tirumala pilgrimage expenses: Travel toll passes, local cab fares, TTD accommodation costs, and prasadam budgets.',
  keywords: [
    'Tirupati trip budget calculator',
    'Tirumala pilgrimage cost estimator',
    'Tirupati toll fee charges',
    'TTD accommodation rates Tirumala',
    'Tirupati family trip planning expenses',
    'తిరుపతి యాత్ర ఖర్చుల అంచనా',
  ],
  alternates: {
    canonical: `${baseUrl}/trip-estimator`,
  },
  openGraph: {
    title: 'Tirupati & Tirumala Pilgrimage Budget Estimator | Saarthi Guide',
    description: 'Calculate your travel, toll passes, accommodation, and darshan costs for Tirupati & Tirumala with Saarthi.',
    url: `${baseUrl}/trip-estimator`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Saarthi Trip Cost & Budget Estimator',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tirupati & Tirumala Pilgrimage Budget Estimator',
    description: 'Calculate pilgrimage expenses, toll fees, and lodging costs for Tirupati & Tirumala.',
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function TripEstimatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
