import { Suspense } from 'react';
import Chrome from '@/components/layout/Chrome';
import Footer from '@/components/layout/Footer';
import Navbar, { NavbarFallback } from '@/components/layout/Navbar';
import SiteLogo from '@/components/layout/SiteLogo';
import SmoothScroll from '@/components/layout/SmoothScroll';
import ThemeStyle from '@/components/layout/ThemeStyle';
import { getTheme } from '@/lib/themeServer';
import TopBarsLoader from '@/components/layout/TopBarsLoader';
import './globals.css';

export async function generateMetadata() {
  let icon = '/images/logo.webp';
  try {
    icon = (await getTheme()).logo_url || icon;
  } catch {}   // API coupée : favicon d'origine
  return {
    title: { default: 'QUEEN Cosmetics', template: '%s · QUEEN Cosmetics' },
    description: "Parfums, soins et maquillage — paiement à la livraison partout au Maroc.",
    icons: { icon },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <ThemeStyle />
        </Suspense>
        <Suspense fallback={<NavbarFallback />}>
          <Chrome>
            <Suspense fallback={null}>
              <TopBarsLoader />
            </Suspense>
            <Suspense fallback={<NavbarFallback />}>
              <Navbar logo={<SiteLogo />} />
            </Suspense>
          </Chrome>
        </Suspense>
        <SmoothScroll />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
