'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { logout, refreshMe, ROLE_LABELS } from '@/lib/auth';
import { initial } from '@/lib/format';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import { useCartCount } from '@/store/cartStore';
import { toast } from '@/store/toastStore';

const Icon = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  shop: <><path d="M4 7h16l-1.5 12.5a1 1 0 0 1-1 .9h-11a1 1 0 0 1-1-.9z" /><path d="M8.5 7V6a3.5 3.5 0 0 1 7 0v1" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2.6l2.4 12.2a1 1 0 0 0 1 .8h9.4a1 1 0 0 0 1-.8L20.5 7H6" /></>,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 16l-4-4 4-4M6 12h10" /></>,
};
const Svg = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true">{Icon[name]}</svg>;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartCount();
  const [notif, setNotif] = useState(0);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const me = hydrated ? user : null;
  const isClient = me?.role === 'client';

  // Rôle relu en base au chargement (comme l'ancien site à chaque requête)
  useEffect(() => {
    refreshMe();
  }, []);

  // Badge notifications (clients uniquement)
  useEffect(() => {
    if (!isClient) return;
    let alive = true;
    api.get('/notifications/count').then(({ data }) => alive && setNotif(data.count)).catch(() => {});
    return () => {
      alive = false;
    };
  }, [isClient, pathname]);

  // Ferme le menu profil au clic extérieur
  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  async function onLogout() {
    setOpen(false);
    await logout();
    toast.success('Vous êtes déconnecté.');
    router.refresh();
  }

  const link = (href, label, icon, badge) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
      <li>
        <Link href={href} className={`nav-link${active ? ' active' : ''}`}>
          <Svg name={icon} />
          <span>{label}</span>
          {badge > 0 && <b className="badge">{badge}</b>}
        </Link>
      </li>
    );
  };

  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Navigation principale">
        <Link href="/" className="brand" aria-label="QUEEN Cosmetics — accueil">
          <Image src="/images/logo.webp" alt="QUEEN Cosmetics" width={87} height={58} priority />
        </Link>

        <ul className="nav-main">
          {link('/', 'Accueil', 'home')}
          {link('/products', 'Produits', 'shop')}
          {link('/cart', 'Panier', 'cart', hydrated ? cartCount : 0)}
          {isClient && link('/notifications', 'Notifications', 'bell', notif)}
        </ul>

        <div className="nav-actions">
          {me && me.role !== 'client' && (
            <Link href={me.home} className="staff-link">Espace {ROLE_LABELS[me.role]?.toLowerCase()}</Link>
          )}
          {me ? (
            <div className={`profile${open ? ' open' : ''}`} ref={menuRef}>
              <button type="button" className="profile-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                <span className="avatar">{initial(me.name)}</span>
                <span className="profile-email">{me.email}</span>
                <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div className="profile-menu">
                <div className="pm-head">
                  <span className="avatar lg">{initial(me.name)}</span>
                  <div>
                    <strong>{me.name}</strong>
                    <small>{me.email}</small>
                    <small>{ROLE_LABELS[me.role]}</small>
                  </div>
                </div>
                <button type="button" className="pm-item danger" onClick={onLogout}>
                  <Svg name="logout" /> Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn btn-gold btn-sm">Connexion</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

/** Version statique affichée le temps que la navbar (qui dépend de l'URL) se charge */
export function NavbarFallback() {
  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Navigation principale">
        <Link href="/" className="brand" aria-label="QUEEN Cosmetics — accueil">
          <Image src="/images/logo.webp" alt="QUEEN Cosmetics" width={87} height={58} priority />
        </Link>
        <span />
        <span />
      </nav>
    </header>
  );
}
