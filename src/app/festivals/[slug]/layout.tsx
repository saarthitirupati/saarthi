import { Metadata } from 'next';
import { FESTIVALS_2026 } from '@/data/festivals';

interface FestivalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = decodeURIComponent(slug || '').trim().toLowerCase();
  const fest = FESTIVALS_2026.find(f => f.id.toLowerCase() === targetSlug) || FESTIVALS_2026[0];

  const title = `${fest.name} 2026: Date, Timings & Crowd Forecast | Saarthi Guide`;
  const description = `${fest.name} at ${fest.location} on ${fest.date}. Expected crowd: ${fest.expectedCrowd}. Recommended darshan timings: ${fest.recommendedTime}. Dress code: ${fest.dressCode}.`;
  const canonicalUrl = `${baseUrl}/festivals/${fest.id}`;

  return {
    title,
    description,
    keywords: [
      `${fest.name} 2026`,
      `${fest.name} Tirupati`,
      `${fest.name} Tirumala`,
      `${fest.name} date`,
      `${fest.name} crowd status`,
      'Tirumala festival dates 2026',
      'TTD festival calendar',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Saarthi Guide',
      images: [
        {
          url: `${baseUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${fest.name} 2026 Celebration in Tirupati`,
        },
      ],
      locale: 'en_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/twitter-image`],
    },
  };
}

export default async function FestivalSlugLayout({ children, params }: FestivalLayoutProps) {
  const { slug } = await params;
  const targetSlug = decodeURIComponent(slug || '').trim().toLowerCase();
  const fest = FESTIVALS_2026.find(f => f.id.toLowerCase() === targetSlug) || FESTIVALS_2026[0];

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: `${fest.name} 2026`,
    startDate: fest.date,
    location: {
      '@type': 'Place',
      name: fest.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tirumala / Tirupati',
        addressRegion: 'Andhra Pradesh',
        addressCountry: 'IN',
      },
    },
    description: fest.specialTips || `${fest.name} celebrated with divine splendor across Tirupati and Tirumala temples.`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {children}
    </>
  );
}
