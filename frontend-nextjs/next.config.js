const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
const apiIsLocal = ['localhost', '127.0.0.1', '::1'].includes(apiUrl.hostname);

const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', ''),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/images/**',
      },
    ],
    unoptimized: apiIsLocal,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
