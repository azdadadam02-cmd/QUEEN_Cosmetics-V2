import { Suspense } from 'react';
import Footer from '@/components/layout/Footer';
import Navbar, { NavbarFallback } from '@/components/layout/Navbar';
import SmoothScroll from '@/components/layout/SmoothScroll';
import TopBarsLoader from '@/components/layout/TopBarsLoader';
import Toaster from '@/components/ui/Toaster';
import './globals.css';

export const metadata = {
  title: { default: 'QUEEN Cosmetics', template: '%s · QUEEN Cosmetics' },
  description: "Parfums, soins et maquillage — paiement à la livraison partout au Maroc.",
  icons: { icon: '/images/logo.webp' },
};

/** Gabarit commun à toutes les pages : navbar + contenu + footer */
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
        {/* Barres avant la navbar : elles partent avec le scroll, la navbar (sticky) reste en haut */}
        <Suspense fallback={null}>
          <TopBarsLoader />
        </Suspense>
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <SmoothScroll />
        <Toaster />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
