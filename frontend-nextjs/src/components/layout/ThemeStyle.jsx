import { connection } from 'next/server';
import { googleFontsHref, themeCss } from '@/lib/theme';
import { getTheme } from '@/lib/themeServer';

/** Applique l'apparence choisie par l'admin. Si l'API ne répond pas, le site garde son apparence d'origine (et réessaie à la visite suivante). */
export default async function ThemeStyle() {
  let theme;
  try {
    theme = await getTheme();
  } catch {
    await connection();   // rendu à chaque visite tant que l'API est coupée : l'échec n'est pas figé dans la page
    return null;
  }
  const fonts = googleFontsHref(theme);
  return (
    <>
      {fonts && <link rel="stylesheet" href={fonts} />}
      <style>{themeCss(theme)}</style>
    </>
  );
}
