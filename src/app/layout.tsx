import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const dmSerifDisplay = { variable: "--font-hero" };
const plusJakartaSans = { variable: "--font-heading" };
const inter = { variable: "--font-body" };
const notoSansTelugu = { variable: "--font-telugu" };

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Saarthi: Tirumala & Tirupati Pilgrim Guide | Live Darshan, SSD Tokens & Maps",
    template: "%s | Saarthi Guide"
  },
  description: "Saarthi is the #1 trusted pilgrimage guide for Tirupati and Tirumala. Real-time TTD darshan wait times, free SSD token counter status, 74+ offline temple precinct maps, ghat road speed rules & daily Bhagavad Gita.",
  keywords: [
    "tirumala saarthi",
    "saarthi tirupati",
    "saarthi tirumala",
    "tirupati saarthi",
    "tirumala saarthi tirupati",
    "saarthi guide",
    "saarthi guide tirupati",
    "saarthi app tirupati",
    "Tirumala darshan wait time today",
    "Tirupati temple timings",
    "TTD SSD tokens status",
    "Kapila Theertham Tirupati",
    "Srivari Padalu Tirumala",
    "Sri Venkateswara Swamy Temple",
    "Padmavathi Ammavari Temple Tiruchanur",
    "Tirupati yatra companion",
    "తిరుమల సారథి",
    "సారథి తిరుపతి",
    "తిరుమల దర్శనం సమయాలు",
    "తిరుపతి ఆలయాలు"
  ],
  authors: [{ name: "Saarthi Guide Team" }],
  creator: "Saarthi Guide",
  publisher: "Saarthi Guide",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Saarthi: Tirumala & Tirupati Pilgrim Guide | Live Darshan & Offline Maps",
    description: "Saarthi — Your trusted divine companion for Tirupati & Tirumala. Verified TTD wait times, free SSD tokens, temple timings, dress codes, Sthala Puranas, and 100% offline precinct maps.",
    url: baseUrl,
    siteName: "Saarthi Guide",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "Saarthi: Tirupati & Tirumala Pilgrim Guide",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saarthi: Tirumala & Tirupati Pilgrim Guide",
    description: "Live TTD darshan wait times, free SSD token counters, offline maps & temple guides for Tirupati & Tirumala.",
    images: ["/logo.png"],
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
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Saarthi Guide"
  },
};

export const viewport: Viewport = {
  themeColor: "#0F5132",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "Saarthi Guide",
      "alternateName": [
        "Saarthi",
        "Saarthi Tirupati",
        "Tirumala Saarthi",
        "Tirupati Saarthi",
        "Tirumala Saarthi Tirupati",
        "Saarthi App",
        "సారథి తిరుపతి",
        "తిరుమల సారథి"
      ],
      "description": "The official digital companion for Tirupati & Tirumala pilgrims. 100% offline temple precinct maps, live TTD darshan waiting times, and authentic Sthala Puranas.",
      "publisher": {
        "@type": "Organization",
        "name": "Saarthi Guide",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`
      }
    },
    {
      "@type": "TouristInformationCenter",
      "@id": `${baseUrl}/#center`,
      "name": "Saarthi: Tirupati & Tirumala Pilgrim Guide",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "image": `${baseUrl}/logo.png`,
      "description": "Tirupati & Tirumala pilgrimage guide with real-time darshan wait times, temple timings, dress codes, free SSD tokens, and 100% offline precinct maps.",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Tirupati & Tirumala, Andhra Pradesh, India"
      },
      "knowsAbout": [
        "Sri Venkateswara Swamy Temple Tirumala",
        "Srivari Padalu",
        "Kapila Theertham",
        "TTD Darshan Wait Times",
        "Tirupati Temples & Heritage",
        "SSD Token Counters",
        "Tirumala Ghat Road Rules"
      ]
    }
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
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
        {/* Preconnect and Load Crisp Google Fonts including Noto Sans Telugu */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
