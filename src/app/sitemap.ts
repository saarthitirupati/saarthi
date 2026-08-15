import { MetadataRoute } from 'next';
import { PLACES } from '@/data/places';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saarthiguide.in';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trip-estimator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const placePages: MetadataRoute.Sitemap = PLACES.map((place) => ({
    url: `${baseUrl}/place/${place.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: place.isMustVisit ? 0.9 : 0.7,
  }));

  return [...staticPages, ...placePages];
}
