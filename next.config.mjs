/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Added to allow Next.js dev server access from your network IP
  allowedDevOrigins: ['192.168.1.143'],
}

export default nextConfig

