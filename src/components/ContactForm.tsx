import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useInView } from 'react-intersection-observer'

const ContactForm = () => {
  const { t } = useTranslation('common')
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-soft-white to-light-gray">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 overflow-visible"
        >
          <h2 className="section-title">
            {t('contact.title')}
          </h2>
          <p className="section-subtitle">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        {/* Contact Information Only - Form Removed */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                {/* Phone */}
                <div className="flex flex-col items-center text-center p-4 sm:p-6 md:p-8 h-full">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 flex-shrink-0">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">{t('contact.info.phone_label')}</h4>
                  <div className="space-y-3 flex-grow flex flex-col justify-center">
                    <a 
                      href={`tel:${t('contact.info.phone')}`} 
                      className="text-base sm:text-lg font-bold text-royal-blue hover:text-blue-700 transition-colors duration-300 block"
                    >
                      {t('contact.info.phone')}
                    </a>
                    <a 
                      href={`tel:${t('contact.info.phone_secondary')}`} 
                      className="text-base sm:text-lg font-bold text-royal-blue hover:text-blue-700 transition-colors duration-300 block"
                    >
                      {t('contact.info.phone_secondary')}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col items-center text-center p-4 sm:p-6 md:p-8 h-full">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 flex-shrink-0">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">{t('contact.info.email_label')}</h4>
                  <div className="flex-grow flex flex-col justify-center">
                    <a 
                      href={`mailto:${t('contact.info.email')}`} 
                      className="text-base sm:text-lg font-bold text-royal-blue hover:text-blue-700 transition-colors duration-300 break-words"
                    >
                      {t('contact.info.email')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm 