/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['hihitutor-dev-backend.onrender.com'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
