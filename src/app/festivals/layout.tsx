import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: '2026 Tirupati & Tirumala Festival Calendar: Dates, Panchangam & Crowd Predictions',
  description: 'Complete 2026 Tirumala & Tirupati festival dates, Srivari Brahmotsavam schedule, Telugu Panchangam auspicious tithis, Vratams & live crowd predictions.',
  keywords: [
    'Tirumala festival dates 2026',
    'Tirupati Brahmotsavam 2026',
    'TTD festival calendar 2026',
    'Telugu Panchangam 2026 Tirumala',
    'Vaikuntha Ekadasi 2026 Tirumala',
    'Rathasapthami Tirupati 2026',
    'Tirumala crowd prediction today',
    'తిరుమల పండుగలు 2026',
    'తిరుపతి బ్రహ్మోత్సవాలు',
  ],
  alternates: {
    canonical: `${baseUrl}/festivals`,
  },
  openGraph: {
    title: '2026 Tirupati & Tirumala Festival Calendar | Saarthi Guide',
    description: '172+ verified festival dates, Telugu Panchangam, auspicious days, and crowd rush forecasts for Tirumala and Tirupati temples.',
    url: `${baseUrl}/festivals`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: '2026 Festival Calendar - Saarthi Guide',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 Tirupati & Tirumala Festival Calendar | Saarthi Guide',
    description: 'Complete 2026 festival schedule, Telugu Panchangam, and crowd rush forecasts for Tirupati & Tirumala.',
    images: [`${baseUrl}/logo.png`],
  },
};

export default function FestivalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
