import Image from 'next/image';
import { Suspense } from 'react';
import { getTheme } from '@/lib/themeServer';

const DEFAULT_LOGO = '/images/logo.webp';
const Logo = ({ src }) => <Image src={src} alt="QUEEN Cosmetics" width={87} height={58} priority />;

async function ThemedLogo() {
  let src = DEFAULT_LOGO;
  try {
    src = (await getTheme()).logo_url || DEFAULT_LOGO;
  } catch {}   // API coupée : logo d'origine
  return <Logo src={src} />;
}

/** Logo choisi par l'admin (cache du thème), logo d'origine pendant le chargement ou si l'API ne répond pas */
export default function SiteLogo() {
  return (
    <Suspense fallback={<Logo src={DEFAULT_LOGO} />}>
      <ThemedLogo />
    </Suspense>
  );
}
