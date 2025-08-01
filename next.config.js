/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

// Extract hostname from Supabase URL for dynamic configuration
const getSupabaseHostname = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl)
      return url.hostname
    } catch (error) {
      console.warn('Could not parse NEXT_PUBLIC_SUPABASE_URL:', error)
    }
  }
  // Fallback to current known domain
  return 'klyymqfepozzaycsntaf.supabase.co'
}

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getSupabaseHostname(),
        port: '',
        pathname: '/storage/v1/object/public/announcements/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Deployment configuration (uncomment for static export)
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'dist',
}

module.exports = nextConfig 