/** @type {import('next').NextConfig} */

// Adresse de l'API Laravel (php artisan serve → http://localhost:8000)
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
const apiIsLocal = ['localhost', '127.0.0.1', '::1'].includes(apiUrl.hostname);

const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    // Autorise les images des produits / publicités servies par Laravel (public/images)
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', ''),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/images/**',
      },
    ],
    // En local, Next.js refuse d'optimiser les images d'une IP locale (sécurité) :
    // on les affiche telles quelles. En production (vrai domaine), l'optimisation est active.
    unoptimized: apiIsLocal,
  },

  // En-têtes de sécurité du site (équivalent des en-têtes de l'ancien security.php)
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
