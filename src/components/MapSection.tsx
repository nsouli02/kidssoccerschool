import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useInView } from 'react-intersection-observer'

const MapSection = () => {
  const { t } = useTranslation('common')
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Training locations data
  const locations = [
    {
      id: 'michalonikeio',
      name: t('map.location_name'),
      latitude: 34.971252,
      longitude: 33.841896,
    },
    {
      id: 'ethnikos-training',
      name: t('map.location_name_2'),
      latitude: 35.03686750240995,
      longitude: 33.76718207827966,
    },
    {
      id: 'ethnikos-futsal',
      name: t('map.location_name_3'),
      latitude: 35.03301677491215,
      longitude: 33.7647437862309,
    }
  ]

  // State for selected location (default to first location)
  const [selectedLocation, setSelectedLocation] = useState(locations[0])
  const [mapKey, setMapKey] = useState(0)
  const [mapError, setMapError] = useState(false)

  // Force map reload when location changes
  useEffect(() => {
    setMapKey(prev => prev + 1)
  }, [selectedLocation.id])

  // Dynamic URLs based on selected location
  const googleMapsUrl = `https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`
  const appleMapsUrl = `https://maps.apple.com/?q=${selectedLocation.latitude},${selectedLocation.longitude}`
  const wazeUrl = `https://waze.com/ul?ll=${selectedLocation.latitude},${selectedLocation.longitude}&navigate=yes`

  // Dynamic Google Maps embed URL with satellite view (no API key needed)
  const embedUrl = `https://maps.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}&t=h&z=17&ie=UTF8&iwloc=&output=embed`

  return (
    <section id="location" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            {t('map.title')}
          </h2>
          <p className="section-subtitle">
            {t('map.subtitle')}
          </p>
        </motion.div>

        {/* Location Selection Radio Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-soft-white rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-royal-blue mb-4 text-center">
            {t('map.select_location')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {locations.map((location) => (
              <label
                key={location.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedLocation.id === location.id
                    ? 'border-royal-blue bg-blue-50 text-royal-blue shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <input
                  type="radio"
                  name="training-location"
                  value={location.id}
                  checked={selectedLocation.id === location.id}
                  onChange={() => setSelectedLocation(location)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedLocation.id === location.id
                      ? 'border-royal-blue'
                      : 'border-gray-300'
                  }`}>
                    {selectedLocation.id === location.id && (
                      <div className="w-2 h-2 bg-royal-blue rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-sm leading-tight">{location.name}</span>
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
            key={selectedLocation.id} // Force re-render when location changes
          >
            <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg aspect-video">
              {mapError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  <div className="text-center p-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-lg font-semibold mb-2">Map temporarily unavailable</p>
                    <p className="text-sm">Use the buttons below to open in map applications</p>
                  </div>
                </div>
              ) : (
                <iframe
                  key={`map-${mapKey}-${selectedLocation.id}`}
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${selectedLocation.name}`}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  onError={() => setMapError(true)}
                />
              )}
            </div>
          </motion.div>

          {/* Location Info & Map Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
                         {/* Location Details */}
             <div className="bg-soft-white rounded-2xl p-8">
               <h3 className="text-2xl font-bold text-royal-blue mb-4">
                 {selectedLocation.name}
               </h3>
               <div className="space-y-3 text-gray-600">
                 <div className="flex items-center space-x-3">
                   <svg className="w-5 h-5 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   <span>{selectedLocation.name}</span>
                 </div>
                 <div className="flex items-center space-x-3">
                   <svg className="w-5 h-5 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                   </svg>
                   <span>{t('map.coordinates')}: {selectedLocation.latitude}, {selectedLocation.longitude}</span>
                 </div>
               </div>
             </div>

            {/* Map App Buttons */}
            <div className="bg-soft-white rounded-2xl p-8">
              <h4 className="text-lg font-semibold text-royal-blue mb-6">
                {t('map.open_in')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Google Maps */}
                <motion.a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-royal-blue"
                >
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="font-medium">Google Maps</span>
                </motion.a>

                {/* Apple Maps */}
                <motion.a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-royal-blue"
                >
                  <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="font-medium">Apple Maps</span>
                </motion.a>

                {/* Waze */}
                <motion.a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-royal-blue"
                >
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="font-medium">Waze</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MapSection 