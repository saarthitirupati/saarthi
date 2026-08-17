import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const dmSerifDisplay = { variable: "--font-hero" };
const plusJakartaSans = { variable: "--font-heading" };
const inter = { variable: "--font-body" };
const notoSansTelugu = { variable: "--font-telugu" };

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
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/icon-192.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Saarthi"
  },
};

export const viewport: Viewport = {
  themeColor: "#0F5132",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NFJVHVBK';

  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} ${inter.variable} ${notoSansTelugu.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <script
          id="gtm-script"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        {/* End Google Tag Manager */}
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
