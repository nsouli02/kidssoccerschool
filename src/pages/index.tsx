import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'

// Import all components
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Programs from '@/components/Programs'
import Gallery from '@/components/Gallery'
import SocialMedia from '@/components/SocialMedia'
import ContactForm from '@/components/ContactForm'
import MapSection from '@/components/MapSection'
import Footer from '@/components/Footer'

export default function Home() {
  const { t } = useTranslation('common')
  const router = useRouter()

  // Scroll to top on language change and page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [router.locale])

  // Scroll to top on initial page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <Head>
        <title>{`${t('common.academy_name')} - ${t('common.tagline')}`}</title>
        <meta name="description" content="Professional youth soccer school in Cyprus. Building character through football with programs for ages 3-17. Join our school today!" />
        <meta name="keywords" content="youth soccer, football school, Cyprus, children sports, soccer training, football coaching" />
        <meta name="author" content="Kids Soccer School" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={`${t('common.academy_name')} - ${t('common.tagline')}`} />
        <meta property="og:description" content="Professional youth soccer school building character through football" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kidssoccerschool.com" />
        <meta property="og:image" content="https://kidssoccerschool.com/images/soccer_background_2.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('common.academy_name')} - ${t('common.tagline')}`} />
        <meta name="twitter:description" content="Professional youth soccer school building character through football" />
        <meta name="twitter:image" content="https://kidssoccerschool.com/images/soccer_background_2.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsClub",
              "name": t('common.academy_name'),
              "description": "Professional youth soccer school building character through football",
              "url": "https://kidssoccerschool.com",
              "logo": "https://kidssoccerschool.com/images/socker_logo.jpg",
              "telephone": "+357 99530979",
              "email": "kids.soccer.school@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Cyprus",
                "addressLocality": "Nicosia"
              },
              "sport": "Soccer",
              "priceRange": "€€"
            }),
          }}
        />
      </Head>

      <div className="min-h-screen">
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main>
          <Hero />
          <About />
          <Programs />
          <Gallery />
          <SocialMedia />
          <ContactForm />
          <MapSection />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
} 