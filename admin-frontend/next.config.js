/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
  // Enable static optimization
  swcMinify: true,
  // Configure image domains if needed
  images: {
    domains: [],
  },
}

module.exports = nextConfig
