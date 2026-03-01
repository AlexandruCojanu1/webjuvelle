import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Banner from '@/components/sections/Banner'
import ExpertiseSection from '@/components/sections/ExpertiseSection'
import { OrganizationSchema, WebsiteSchema, ServiceSchema } from '@/components/seo/StructuredData'

// Lazy load components Below the Fold for better initial load performance
const ChooseUsSection = dynamic(() => import('@/components/sections/ChooseUsSection'), {
  loading: () => null, // No loading indicator to prevent layout shift
})
const GuideBannerSection = dynamic(() => import('@/components/sections/GuideBannerSection'), {
  loading: () => null,
})
const ServiceSection = dynamic(() => import('@/components/sections/ServiceSection'), {
  loading: () => null,
})
const DigitalProcessSection = dynamic(() => import('@/components/sections/DigitalProcessSection'), {
  loading: () => null,
})
const PricingSection = dynamic(() => import('@/components/sections/PricingSection'), {
  loading: () => null,
})
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), {
  loading: () => null,
})
const NewsletterSection = dynamic(() => import('@/components/sections/NewsletterSection'), {
  loading: () => null,
})

// Page-specific metadata (merges with root layout)
export const metadata: Metadata = {
  title: 'Webjuvelle - AI Website Builder',
  description: 'Generate a professional website extremely fast and simple with Artificial Intelligence. Answer a few questions and launch your online business.',
  openGraph: {
    title: 'Webjuvelle - AI Website Builder',
    description: 'Generate a professional website extremely fast and simple with Artificial Intelligence. Answer a few questions and launch your online business.',
    url: 'https://www.webjuvelle.com', // Update with actual domain if known
    images: ['/opengraph-image.jpg'],
  },
}

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <OrganizationSchema siteUrl="https://www.webjuvelle.com" />
      <WebsiteSchema siteUrl="https://www.webjuvelle.com" />
      <ServiceSchema siteUrl="https://www.webjuvelle.com" />

      {/* Main Content */}
      <main>
        <Banner />
        <ExpertiseSection />
        <ChooseUsSection />
        <GuideBannerSection />
        <ServiceSection />
        <DigitalProcessSection />
        <PricingSection />
        <FAQSection />
        <NewsletterSection />
      </main>
    </>
  )
}

