import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const About = () => {
  const { t } = useTranslation('common')
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const values = [
    {
      title: t('about.values.sportsmanship.title'),
      description: t('about.values.sportsmanship.description'),
      icon: '🤝',
    },
    {
      title: t('about.values.teamwork.title'),
      description: t('about.values.teamwork.description'),
      icon: '⚽',
    },
    {
      title: t('about.values.confidence.title'),
      description: t('about.values.confidence.description'),
      icon: '💪',
    },
  ]

  const facts = [
    t('about.facts.established'),
    t('about.facts.location'),
    t('about.facts.ages'),
  ]

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 overflow-visible"
        >
          <h2 className="section-title">
            {t('about.title')}
          </h2>
          <p className="section-subtitle">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Coach Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-soft-white rounded-2xl p-8 card-hover">
              <div className="w-full max-w-xs mx-auto mb-6 overflow-hidden rounded-xl">
                <Image 
                  src="/images/soccer_kid.jpg" 
                  alt="Soccer Kid"
                  width={200}
                  height={150} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t('about.coach_bio')}
              </p>
            </div>

            {/* Quick Facts */}
            <div className="bg-soft-white rounded-2xl p-6 card-hover">
              <h4 className="text-xl font-bold mb-4">{t('about.facts.title')}</h4>
              <ul className="space-y-2">
                {facts.map((fact, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-golden-yellow rounded-full mr-3" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Academy Description and Values */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('about.description')}
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-royal-blue mb-6">
                {t('about.values.title')}
              </h4>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                    className="bg-soft-white rounded-xl p-6 card-hover border-l-4 border-golden-yellow"
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl">{value.icon}</span>
                      <div>
                        <h5 className="text-xl font-semibold text-royal-blue mb-2">
                          {value.title}
                        </h5>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About 