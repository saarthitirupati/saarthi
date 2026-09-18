import { MetadataRoute } from 'next';
import { PLACES } from '@/data/places';
import { FESTIVALS_2026 } from '@/data/festivals';
import { darshanRegistry } from '@/content/darshans';
import { KNOWLEDGE_ITEMS } from '@/content/knowledge';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: now,
      changeFrequency: 'always',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/essentials`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/festivals`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trip-estimator`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/itinerary`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journey`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/weather`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/route`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/documents`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/offline-maps`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learn/stories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/learn/story-of-the-day`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const placePages: MetadataRoute.Sitemap = PLACES.map((place) => ({
    url: `${baseUrl}/place/${place.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: place.isMustVisit ? 0.95 : 0.85,
  }));

  const festivalPages: MetadataRoute.Sitemap = FESTIVALS_2026.map((fest) => ({
    url: `${baseUrl}/festivals/${fest.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: (fest.gravityScore || 5) >= 8 ? 0.9 : 0.8,
  }));

  const darshanPages: MetadataRoute.Sitemap = Object.keys(darshanRegistry).map((key) => ({
    url: `${baseUrl}/darshan/${key}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const essentialsPages: MetadataRoute.Sitemap = KNOWLEDGE_ITEMS.map((item) => ({
    url: `${baseUrl}/essentials/${item.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...darshanPages,
    ...placePages,
    ...festivalPages,
    ...essentialsPages,
  ];
}
