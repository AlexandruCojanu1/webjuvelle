/** @type {import('next').NextConfig} */
export default {
  // Enable React 19 features
  reactStrictMode: true,
  
  // Image optimization - Reduced sizes for better performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adsnow.ro',
      },
      {
        protocol: 'https',
        hostname: 'www.adsnow.ro',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // Reduced device sizes to optimize for mobile-first
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Image quality levels used in the project
    qualities: [75, 85, 90],
    // Optimize image quality
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Trailing slash for better SEO
  trailingSlash: false,
  
  // Compression
  compress: true,
  
  // Power SEO headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirect API routes (keep Vercel serverless functions)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

