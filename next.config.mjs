/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Added to allow Next.js dev server access from your network IP
  allowedDevOrigins: ['192.168.1.143'],
}

export default nextConfig

