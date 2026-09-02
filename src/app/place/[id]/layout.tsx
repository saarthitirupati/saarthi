import { Metadata } from 'next';
import { PLACES, getPlaceGuideData } from '@/data/places';

interface PlaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const targetId = decodeURIComponent(id || '').trim().toLowerCase();
  const cleanTarget = targetId.replace(/[^a-z0-9]/g, '');

  const place = PLACES.find(t => {
    const pId = (t.id || '').toLowerCase();
    const pSlug = ((t as any).slug || '').toLowerCase();
    const pName = (t.name || '').toLowerCase();
    const cleanId = pId.replace(/[^a-z0-9]/g, '');
    const cleanSlug = pSlug.replace(/[^a-z0-9]/g, '');
    return pId === targetId || pSlug === targetId || pName === targetId || cleanId === cleanTarget || cleanSlug === cleanTarget || (cleanTarget.length > 5 && cleanId.includes(cleanTarget));
  }) || PLACES[0];

  const guide = getPlaceGuideData(place);
  const title = `${place.name} - Darshan Timings, History & Map | Saarthi Guide`;
  const description = place.shortIntro || place.description?.slice(0, 160) || `${place.name} in Tirupati/Tirumala: Authentic timings, dress code, Sthala Puranam, and offline precinct vector map.`;
  const canonicalUrl = `${baseUrl}/place/${place.id}`;
  const placeImage = place.image || `${baseUrl}/logo.png`;

  const placeKeywords = [
    place.name,
    place.nameTe || '',
    `${place.name} timings`,
    `${place.name} darshan`,
    `${place.name} history`,
    `${place.name} entry fee`,
    `${place.name} dress code`,
    'Tirupati temple guide',
    'Tirumala pilgrimage',
    ...(place.tags || []),
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: placeKeywords,
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
          url: placeImage,
          width: 1200,
          height: 630,
          alt: `${place.name} - Sacred Pilgrimage Guide`,
        },
      ],
      locale: 'en_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [placeImage],
    },
  };
}

export default async function PlaceLayout({ children, params }: PlaceLayoutProps) {
  const { id } = await params;
  const targetId = decodeURIComponent(id || '').trim().toLowerCase();
  const cleanTarget = targetId.replace(/[^a-z0-9]/g, '');

  const place = PLACES.find(t => {
    const pId = (t.id || '').toLowerCase();
    const pSlug = ((t as any).slug || '').toLowerCase();
    const pName = (t.name || '').toLowerCase();
    const cleanId = pId.replace(/[^a-z0-9]/g, '');
    const cleanSlug = pSlug.replace(/[^a-z0-9]/g, '');
    return pId === targetId || pSlug === targetId || pName === targetId || cleanId === cleanTarget || cleanSlug === cleanTarget || (cleanTarget.length > 5 && cleanId.includes(cleanTarget));
  }) || PLACES[0];

  const guide = getPlaceGuideData(place);
  const isTemple = place.placeType === 'spiritual' || place.category === 'Temple' || (place.tags || []).some((t: string) => t.toLowerCase().includes('temple'));
  const schemaType = isTemple ? 'HinduTemple' : 'TouristAttraction';
  const dressCode = (place as any).practicalInfo?.dressCode || (guide.visitorTips as any)?.dressCode || 'Traditional Indian attire recommended';
  const entryCost = guide.entryFee || 'Free Entry';

  // 1. Place / Temple Schema
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: place.name,
    alternateName: place.nameTe,
    description: place.description || place.shortIntro,
    image: place.image || `${baseUrl}/logo.png`,
    url: `${baseUrl}/place/${place.id}`,
    telephone: '08772277777',
    isAccessibleForFree: entryCost.toLowerCase().includes('free'),
    geo: place.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: place.coordinates.lat,
      longitude: place.coordinates.lng,
    } : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.category === 'Tirumala Spot' ? 'Tirumala' : 'Tirupati',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    openingHoursSpecification: place.timings ? {
      '@type': 'OpeningHoursSpecification',
      description: place.timings,
    } : undefined,
  };

  // 2. Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Explore Temples',
        item: `${baseUrl}/explore`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: place.name,
        item: `${baseUrl}/place/${place.id}`,
      },
    ],
  };

  // 3. FAQ Schema for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the opening and darshan timings for ${place.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: place.timings ? `The timings for ${place.name} are: ${place.timings}.` : `Timings vary based on daily pooja rituals and festivals.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the dress code required at ${place.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Dress code guidelines: ${dressCode}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the spiritual significance (Sthala Puranam) of ${place.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: place.history || guide.whyVisit || place.description || `${place.name} is a revered landmark in the sacred Tirupati-Tirumala pilgrimage circuit.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is entry free at ${place.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Entry details: ${entryCost}.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
