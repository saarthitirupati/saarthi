import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Pilgrimage Journey Companion: Live Footpath & Ghat Road Guide',
  description: 'Live pilgrimage assistant for Alipiri and Srivari Mettu trekking routes, Ghat road safety speed timers, checkpoint assistance, and holy hill milestones.',
  keywords: [
    'Alipiri footpath steps count',
    'Srivari Mettu trek guide',
    'Tirumala pedestrian path rules',
    'Ghat road live speed timer',
    'అలిపిరి మెట్ల మార్గం',
    'శ్రీవారి మెట్టు నడక మార్గం',
  ],
  alternates: {
    canonical: `${baseUrl}/journey`,
  },
  openGraph: {
    title: 'Pilgrimage Journey & Trekking Companion | Saarthi Guide',
    description: 'Track your Alipiri & Srivari Mettu pedestrian climb and Ghat road transit with real-time pilgrimage guidance.',
    url: `${baseUrl}/journey`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Saarthi Pilgrimage Journey Companion',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pilgrimage Journey & Trekking Companion',
    description: 'Real-time guidance for Alipiri, Srivari Mettu, and Ghat road pilgrims.',
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
