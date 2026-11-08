'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import RequireRole from '@/components/layout/RequireRole';
import { api } from '@/lib/api';
import { logout } from '@/lib/auth';
import { toast } from '@/store/toastStore';

const Svg = ({ children, fill }) => <svg viewBox="0 0 24 24" aria-hidden="true" className={fill ? 'fill' : ''}>{children}</svg>;

const NAV = [
  ['/', 'Home', <Svg key="h" fill><path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" /></Svg>],
  ['/profile', 'Account Details', <Svg key="a"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.7V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.7" /></Svg>],
  ['/profile/orders', 'My Orders', <Svg key="o"><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></Svg>],
  ['/profile/favorites', 'Mon favoris', <Svg key="f" fill><path d="M12 21C5 15.5 2 12.3 2 8.5A5.3 5.3 0 0 1 7.5 3 5.6 5.6 0 0 1 12 5.3 5.6 5.6 0 0 1 16.5 3 5.3 5.3 0 0 1 22 8.5c0 3.8-3 7-10 12.5z" /></Svg>],
  ['/profile/report', 'Report', <Svg key="r"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8" /><path d="M16 17H8" /></Svg>],
];

const SERVICES = [
  ['whatsapp', 'WhatsApp', (v) => v, <Svg key="w"><path d="M3 21l1.6-5A9 9 0 1 1 8 19.4z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-2-2-1-1 1a5 5 0 0 1-2.5-2.5l1-1-1-2z" /></Svg>],
  ['facebook', 'Facebook', (v) => v, <Svg key="b" fill><path d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 12 2z" /></Svg>],
  ['instagram', 'Instagram', (v) => v, <Svg key="i"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" /></Svg>],
  ['twitter', 'Twitter', (v) => v, <Svg key="x"><path d="m4 4 16 16M20 4 4 20" /></Svg>],
  ['gmail', 'Gmail', (v) => `mailto:${v}`, <Svg key="g"><rect x="2" y="5" width="20" height="14" rx="1" /><path d="m2 6 10 8 10-8" /></Svg>],
];

export const LeaveContext = createContext(() => {});

export default function ProfileShell({ children }) {
  // Next garde la page quittée dans le DOM (masquée) : sans ce marqueur, le CSS :has(.pf-shell) cacherait encore la navbar
  const shellRef = useRef(null);
  const [leaving, setLeaving] = useState(false);
  useLayoutEffect(() => {
    const shell = shellRef.current;
    shell.classList.remove('pf-left');
    return () => {
      shell.classList.add('pf-left');
      setLeaving(false);
    };
  }, []);

  // Déconnexion volontaire : RequireRole ne doit pas rediriger vers /login en voyant la session disparaître
  return (
    <div className="pf-shell" ref={shellRef}>
      <LeaveContext.Provider value={() => setLeaving(true)}>
        {!leaving && (
          <RequireRole roles={['client']}>
            <Shell>{children}</Shell>
          </RequireRole>
        )}
      </LeaveContext.Provider>
    </div>
  );
}

function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const leave = useContext(LeaveContext);
  const [links, setLinks] = useState({});
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/service-links').then(({ data }) => setLinks(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (pathname === '/profile/orders') return;
    api.get('/notifications/count').then(({ data }) => setUnread(data.count)).catch(() => {});
  }, [pathname]);

  async function onLogout() {
    leave();
    await logout();
    toast.success('Vous êtes déconnecté.');
    router.push('/');
  }

  return (
    <>
      <aside className="pf-side">
        <Link href="/" className="pf-logo" aria-label="Retour à l'accueil">
          <Image src="/images/logo.webp" alt="QUEEN Cosmetics" width={87} height={58} priority />
        </Link>
        <nav className="pf-nav" aria-label="Mon compte">
          {NAV.map(([href, label, icon]) => (
            <Link key={href} href={href} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined}>
              {icon}
              <span>{label}</span>
              {href === '/profile/orders' && pathname !== href && unread > 0 && <b className="badge">{unread}</b>}
            </Link>
          ))}
        </nav>

        <div className="pf-service">
          <strong>Service</strong>
          {SERVICES.map(([key, label, href, icon]) => (links[key]
            ? <a key={key} href={href(links[key])} target="_blank" rel="noopener noreferrer">{icon}<span>{label}</span></a>
            : <span key={key} className="pf-off" aria-disabled="true" title="Bientôt disponible">{icon}<span>{label}</span></span>
          ))}
        </div>

        <button type="button" className="pf-logout" onClick={onLogout}>
          <Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></Svg>
          Logout
        </button>
      </aside>

      <section className="pf-main">{children}</section>
    </>
  );
}
