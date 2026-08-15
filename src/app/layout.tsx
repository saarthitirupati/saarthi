import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans, Inter, Noto_Sans_Telugu } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hero",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  variable: "--font-telugu",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saarthiguide.in';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Saarthi | Real-Time Tirupati & Tirumala Pilgrim Companion",
    template: "%s | Saarthi"
  },
  description: "Tirupati's trusted pilgrimage companion. Live TTD darshan wait times, SSD token availability, temple timings, dress codes, Sthala Puranas & verified transit guides.",
  keywords: [
    "Tirupati temple timings",
    "Tirumala darshan wait time today",
    "Srivari Padalu Tirumala",
    "TTD SSD tokens status",
    "Kapila Theertham Tirupati",
    "Tirupati local temples guide",
    "Sri Venkateswara Swamy Temple",
    "Padmavathi Ammavari Temple Tiruchanur",
    "Tirupati yatra companion",
    "తిరుమల దర్శనం సమయాలు",
    "తిరుపతి ఆలయాలు"
  ],
  authors: [{ name: "Saarthi Team" }],
  creator: "Saarthi",
  publisher: "Saarthi",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Saarthi | Real-Time Tirupati & Tirumala Pilgrim Companion",
    description: "Know the place before you go. Verified TTD wait times, temple timings, dress codes, Sthala Puranas, and local travel guides for Tirupati & Tirumala.",
    url: baseUrl,
    siteName: "Saarthi",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saarthi | Tirupati & Tirumala Yatra Companion",
    description: "Live TTD darshan wait times, SSD token status, temple guides & local transport info.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
    apple: "/icon.svg",
    shortcut: "/icon.svg"
  },
};

export const viewport: Viewport = {
  themeColor: "#0E6B72",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "TouristInformationCenter",
  "name": "Saarthi",
  "url": baseUrl,
  "description": "Tirupati & Tirumala pilgrimage guide with real-time darshan wait times, temple timings, dress codes, and local transit information.",
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Tirupati & Tirumala, Andhra Pradesh, India"
  },
  "knowsAbout": [
    "Sri Venkateswara Swamy Temple Tirumala",
    "Srivari Padalu",
    "Kapila Theertham",
    "TTD Darshan Wait Times",
    "Tirupati Temples & Heritage"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} ${inter.variable} ${notoSansTelugu.variable}`}>
      <head>
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
