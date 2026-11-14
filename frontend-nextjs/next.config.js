const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
const apiIsLocal = ['localhost', '127.0.0.1', '::1'].includes(apiUrl.hostname);
const isDev = process.env.NODE_ENV === 'development';

// Le token est dans localStorage : même si un script s'injectait, il ne peut rien envoyer ailleurs (connect-src, img-src).
// shortcut: 'unsafe-inline' pour les scripts car Next.js en injecte sans nonce ; passer aux nonces (proxy) pour bloquer aussi le script inline.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `img-src 'self' data: blob: ${apiUrl.origin}`,
  `connect-src 'self' ${apiUrl.origin}${isDev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig = {
  poweredByHeader: false,
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
    // En local, Next.js refuse d'optimiser les images d'une IP locale (sécurité) :
    // on les affiche telles quelles. En production (vrai domaine), l'optimisation est active.
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
          { key: 'Content-Security-Policy', value: csp },
          ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
        ],
      },
    ];
  },
};

module.exports = nextConfig;
