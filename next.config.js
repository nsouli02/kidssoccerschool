/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

// Generate remote patterns dynamically from environment variables
const getRemotePatterns = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found - remote image optimization disabled')
    return []
  }

  try {
    const url = new URL(supabaseUrl)
    return [
      {
        protocol: url.protocol.slice(0, -1), // Remove trailing ':'
        hostname: url.hostname,
        port: url.port || '',
        pathname: '/storage/v1/object/public/announcements/**',
      },
    ]
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_URL:', error)
    return []
  }
}

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: getRemotePatterns(),
    formats: ['image/webp', 'image/avif'],
  },
  // Deployment configuration (uncomment for static export)
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'dist',
}

module.exports = nextConfig 