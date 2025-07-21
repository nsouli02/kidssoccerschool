/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      // No external images needed - using only local images
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Deployment configuration (uncomment for static export)
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'dist',
}

module.exports = nextConfig 