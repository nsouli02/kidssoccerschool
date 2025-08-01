import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Import components
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Announcement {
  id: number
  title: string
  content: string
  location?: string
  eventDate?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export default function Announcements() {
  const { t, i18n } = useTranslation('common')
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  // Helper function to detect and format location links
  const formatLocationDisplay = (location: string) => {
    if (!location) return <span className="ml-1">{t('announcements.none')}</span>

    // Check if location contains a URL (with or without @ prefix)
    const urlPattern = /@?(https?:\/\/[^\s]+)/g
    
    if (urlPattern.test(location)) {
      // Extract the URL (with or without @ prefix)
      const urlMatch = location.match(/@?(https?:\/\/[^\s]+)/)
      const url = urlMatch?.[1] || ''
      const fullMatch = urlMatch?.[0] || ''
      
      // Split the location into parts before and after the URL
      const parts = location.split(fullMatch)
      const textBefore = parts[0]?.trim()
      const textAfter = parts[1]?.trim()
      
      // Determine link text based on URL type
      let linkText = t('announcements.view_link')
      if (url.includes('google.com/maps') || url.includes('maps.google.com') || url.includes('goo.gl/maps') || url.includes('share.google')) {
        linkText = `${t('announcements.view_on_google_maps')} 🗺️`
      } else if (url.includes('apple.com/maps') || url.includes('maps.apple.com')) {
        linkText = `${t('announcements.view_on_apple_maps')} 🗺️`
      } else if (url.includes('waze.com')) {
        linkText = `${t('announcements.open_in_waze')} 🚗`
      }

      return (
        <span className="ml-1">
          {textBefore && (
            <span className="mr-2">{textBefore}</span>
          )}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {linkText}
          </a>
          {textAfter && (
            <span className="ml-2">{textAfter}</span>
          )}
        </span>
      )
    }

    // Regular location text
    return <span className="ml-1">{location}</span>
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (!response.ok) {
        // If it's a 500 error, it might be a configuration issue
        if (response.status === 500) {
          console.error('Server configuration error - check environment variables')
          setError('Server configuration error. Please check that the database is properly configured.')
        } else {
          throw new Error(`Failed to fetch announcements: ${response.status}`)
        }
        return
      }
      const data = await response.json()
      setAnnouncements(data || [])
    } catch (err) {
      setError('Failed to load announcements. Please check your internet connection.')
      console.error('Error fetching announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  // Format event dates - preserve exact time entered (use UTC)
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const locale = i18n.language === 'gr' ? 'el-GR' : 'en-US'
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Preserve intended event time
    })
  }

  // Format posted dates - show in user's local timezone
  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const locale = i18n.language === 'gr' ? 'el-GR' : 'en-US'
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
      // No timeZone specified - uses local timezone
    })
  }

  return (
    <>
      <Head>
        <title>{t('announcements.title')} - {t('common.academy_name')}</title>
        <meta name="description" content={t('announcements.subtitle')} />
      </Head>

      <div className="min-h-screen bg-soft-white">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container-custom section-padding">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="section-title">
                {t('announcements.title')}
              </h1>
              <p className="section-subtitle">
                {t('announcements.subtitle')}
              </p>
            </motion.div>

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto"></div>
                <p className="mt-4 text-gray-600">{t('announcements.loading')}</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">{t('announcements.error')}</p>
              </div>
            )}

            {!loading && !error && announcements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">{t('announcements.no_announcements')}</p>
              </div>
            )}

            {!loading && !error && announcements.length > 0 && (
              <div className="space-y-8">
                {announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
                  >
                    {announcement.imageUrl && (
                      <div className="my-6 flex justify-center">
                        <div className="flex flex-col items-center">
                          <div 
                            className="relative w-64 h-40 cursor-pointer group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow" 
                            onClick={() => setExpandedImage(announcement.imageUrl!)}
                          >
                            <Image
                              src={announcement.imageUrl}
                              alt={announcement.title}
                              fill
                              className="object-cover group-hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                              <div className="bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full p-2 transition-all duration-300">
                                <svg className="w-5 h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{t('announcements.click_to_view')}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-8">
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold text-royal-blue">
                          {announcement.title}
                        </h2>
                      </div>

                      <div className="prose max-w-none mb-6">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span><strong>{t('announcements.location')}:</strong> {formatLocationDisplay(announcement.location || '')}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span><strong>{t('announcements.event_date')}:</strong> {announcement.eventDate ? formatEventDate(announcement.eventDate) : t('announcements.none')}</span>
                        </div>

                        {/* Empty line separator */}
                        <div className="py-2"></div>
                        
                        {/* Posted date in italic */}
                        <div className="text-xs text-gray-500 italic">
                          {t('announcements.posted')}: {formatPostedDate(announcement.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold"
            >
              ✕ Close
            </button>
            <Image
              src={expandedImage}
              alt="Expanded view"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
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