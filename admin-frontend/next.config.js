/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  // Enable static optimization
  swcMinify: true,
  // Configure image domains if needed
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
