import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useInView } from 'react-intersection-observer'

const Programs = () => {
  const { t } = useTranslation('common')
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const ageGroups = [
    {
      key: 'competitive',
      color: 'from-blue-600 to-blue-800',
      icon: '🏆',
    },
    {
      key: 'grassroots',
      color: 'from-green-400 to-green-600',
      icon: '⚽',
    },
    {
      key: 'specialized',
      color: 'from-purple-500 to-purple-700',
      icon: '🥅',
    },
    {
      key: 'girls',
      color: 'from-pink-400 to-pink-600',
      icon: '👧',
    },
    {
      key: 'disney',
      color: 'from-yellow-400 to-orange-500',
      icon: '✨',
    },
    {
      key: 'bambini',
      color: 'from-cyan-400 to-blue-500',
      icon: '👶',
    },
  ]

  return (
    <section id="programs" className="section-padding bg-gradient-to-br from-soft-white to-light-gray">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 overflow-visible"
        >
          <h2 className="section-title">
            {t('programs.title')}
          </h2>
          <p className="section-subtitle">
            {t('programs.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ageGroups.map((group, index) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover h-full flex flex-col"
            >
              <div className={`h-32 bg-gradient-to-r ${group.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-6xl">{group.icon}</span>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-royal-blue mb-3">
                  {t(`programs.age_groups.${group.key}.title`)}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                  {t(`programs.age_groups.${group.key}.description`)}
                </p>
                
                <div className="bg-soft-white rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-royal-blue mb-1">{t('programs.training_schedule')}</p>
                  <p className="text-sm text-gray-600">
                    {t(`programs.age_groups.${group.key}.schedule`)}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-royal-blue text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 mt-auto"
                  onClick={() => {
                    const element = document.getElementById('contact')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  {t('programs.learn_more')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-royal-blue rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">{t('programs.ready_to_start.title')}</h3>
            <p className="text-lg mb-6 opacity-90">
              {t('programs.ready_to_start.subtitle')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('contact')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="btn-secondary"
            >
              {t('programs.ready_to_start.button')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Programs 