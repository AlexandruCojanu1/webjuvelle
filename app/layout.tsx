import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import AsyncCSS from '@/components/client/AsyncCSS'
// Critical CSS - loaded synchronously (above the fold)
import "bootstrap/dist/css/bootstrap.min.css"
import "../src/assets/css/main.css"
import "../src/assets/css/responsive.css" // Critical for mobile-first responsive design
// Non-critical CSS - loaded asynchronously (below the fold)
// Swiper CSS removed - not used in project
// Animate.css moved to AsyncCSS component

// Optimize Google Fonts with next/font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--global-font',
})

// Global Metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://www.adsnow.ro'),
  title: {
    template: '%s | ADSNOW',
    default: 'ADSNOW - Agenție Marketing Digital',
  },
  description: 'Construim identități digitale pentru profesioniști și branduri care aduc valoare. Nu vindem servicii. Alegem parteneri.',
  keywords: ['marketing digital', 'identitate digitală', 'branding', 'SEO', 'social media', 'web design', 'Brașov', 'performance marketing', 'brand strategy'],
  authors: [{ name: 'Algo Digital Solutions' }],
  creator: 'Algo Digital Solutions',
  publisher: 'Algo Digital Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://www.adsnow.ro',
    siteName: 'ADSNOW',
    title: 'ADSNOW - Agenție Marketing Digital',
    description: 'Agenție boutique de strategie digitală și marketing online. Construim identități digitale pentru profesioniști și branduri care aduc valoare.',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ADS Now - Agenție Marketing Digital Brașov',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ADSNOW - Agenție Marketing Digital',
    description: 'Agenție boutique de strategie digitală și marketing online. Construim identități digitale pentru profesioniști și branduri.',
    images: ['/opengraph-image.jpg'],
  },

  // Additional Meta Tags
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

  // Verification
  verification: {
    google: 'your-google-verification-code',
  },

  // Language - Single language site (Romanian only)
  alternates: {
    canonical: 'https://www.adsnow.ro',
  },

  // Favicons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={inter.variable}>
      <head>
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />

        {/* Theme Color */}
        <meta name="theme-color" content="#0D2440" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MF3VS5SV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Async CSS Loading - Non-critical stylesheets */}
        {/* Font Awesome - Loaded async (icons appear progressively) */}
        <AsyncCSS href="/assets/css/vendor/fontawesome.min.css" />
        <AsyncCSS href="/assets/css/vendor/solid.css" />
        <AsyncCSS href="/assets/css/vendor/regular.css" />
        <AsyncCSS href="/assets/css/vendor/brands.css" />

        {/* Note: Responsive CSS is imported directly in layout.tsx (critical for mobile-first) */}
        {/* Note: Animate.css is imported in AnimateOnScroll component */}

        <Header />
        {children}
        <Footer />

        {/* Bootstrap JS - Loaded lazily (only needed for mobile menu and FAQ accordion) */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />

        {/* Google Tag Manager - Loaded lazily to reduce main-thread activity */}
        <Script id="google-tag-manager" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MF3VS5SV');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </body>
    </html>
  )
}

