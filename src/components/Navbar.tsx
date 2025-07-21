import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Ensure page is at top when locale changes
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // Scroll to top when locale changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [router.locale])

  const navigation = [
    { name: t('navigation.home'), href: '#home' },
    { name: t('navigation.about'), href: '#about' },
    { name: t('navigation.programs'), href: '#programs' },
    { name: t('navigation.gallery'), href: '#gallery' },
    { name: t('navigation.contact'), href: '#contact' },
    { name: t('navigation.location'), href: '#location' },
  ]

  const toggleLanguage = () => {
    const newLocale = router.locale === 'en' ? 'gr' : 'en'
    
    // Close mobile menu if open
    setIsMenuOpen(false)
    
    // Scroll to top instantly before language change
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    // Change language - Next.js will handle the content update
    router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="container-custom section-padding py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" locale={router.locale}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                <Image 
                  src="/images/socker_logo.jpg" 
                  alt="Kids Soccer School Logo" 
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="block">
                <h1 className="text-lg sm:text-xl font-bold text-royal-blue">
                  {t('common.academy_name')}
                </h1>
                <p className="hidden sm:block text-sm text-gray-600">{t('common.tagline')}</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-700 hover:text-royal-blue font-medium transition-colors duration-300"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="px-3 py-1 border-2 border-royal-blue text-royal-blue rounded-full font-medium hover:bg-royal-blue hover:text-white transition-all duration-300"
            >
              {router.locale === 'en' ? 'GR' : 'EN'}
            </motion.button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className={`bg-royal-blue block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`} />
              <span className={`bg-royal-blue block h-0.5 w-6 rounded-sm my-1 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`bg-royal-blue block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-200"
            >
              {navigation.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-gray-700 hover:text-royal-blue font-medium transition-colors duration-300"
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar 