import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import Image from 'next/image'

const Gallery = () => {
  const { t } = useTranslation('common')
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Gallery images - only using local custom images
  const galleryImages = [
    {
      src: '/images/soccer_gallery_1.jpg',
      alt: 'Soccer training session',
    },
    {
      src: '/images/soccer_background.jpg',
      alt: 'Soccer training ground',
    },
    {
      src: '/images/soccer_background_2.jpg',
      alt: 'Kids playing soccer on field',
    },
  ]

  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 overflow-visible"
        >
          <h2 className="section-title">
            {t('gallery.title')}
          </h2>
          <p className="section-subtitle">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <div className="aspect-square overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-royal-blue opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={galleryImages[selectedImage].src}
                  alt={galleryImages[selectedImage].alt}
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  className="absolute top-4 right-4 text-white hover:text-golden-yellow transition-colors duration-300"
                  onClick={() => setSelectedImage(null)}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Navigation arrows */}
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-golden-yellow transition-colors duration-300"
                  onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1)}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-golden-yellow transition-colors duration-300"
                  onClick={() => setSelectedImage(selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0)}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Gallery 