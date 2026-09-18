import { Metadata } from 'next';
import { darshanRegistry } from '@/content/darshans';

interface DarshanLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const rawId = decodeURIComponent(id || '').trim().toLowerCase();
  const normalizedId = rawId === 'ssd-tokens' || rawId === 'ssd' ? 'ssd-token' : rawId;
  const data = darshanRegistry[normalizedId] || darshanRegistry['sarva-darshan'];

  const title = `${data.title} Tirumala: Wait Times, Dress Code & Entry Gate | Saarthi Guide`;
  const description = `${data.title} (${data.teluguTitle || 'తిరుమల దర్శనం'}): Complete guide with real-time wait times (${data.waitTime}), entry gate (${data.entryGate}), cost (${data.cost}), and dress code rules.`;
  const canonicalUrl = `${baseUrl}/darshan/${normalizedId}`;

  return {
    title,
    description,
    keywords: [
      `${data.title} Tirumala`,
      `${data.title} wait time today`,
      `${data.title} dress code`,
      `${data.title} entry gate`,
      `${data.title} booking rules`,
      'Tirumala darshan guide',
      'TTD darshan wait time',
      data.teluguTitle || 'తిరుమల దర్శనం',
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
          alt: `${data.title} - Tirumala Srivari Temple Guide`,
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

export default async function DarshanLayout({ children, params }: DarshanLayoutProps) {
  const { id } = await params;
  const rawId = decodeURIComponent(id || '').trim().toLowerCase();
  const normalizedId = rawId === 'ssd-tokens' || rawId === 'ssd' ? 'ssd-token' : rawId;
  const data = darshanRegistry[normalizedId] || darshanRegistry['sarva-darshan'];

  // FAQ Schema for Search Engine Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the wait time for ${data.title} in Tirumala?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Average wait time is approximately ${data.waitTime}. Peak hours are ${data.peakHours}, and the best time to visit is ${data.bestTimeToVisit}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the ticket cost and booking process for ${data.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Cost: ${data.cost}. Booking mode: ${data.bookingMode}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where is the entry gate for ${data.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The designated entry gate is at ${data.entryGate}.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
