import { Suspense } from 'react';
import Footer from '@/components/layout/Footer';
import Navbar, { NavbarFallback } from '@/components/layout/Navbar';
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <Toaster />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
