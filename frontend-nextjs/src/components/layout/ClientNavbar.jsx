'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import { api } from '@/lib/api';
import { logout } from '@/lib/auth';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import { useCartCount } from '@/store/cartStore';
import { toast } from '@/store/toastStore';

const Icon = {
  language: <><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></>,
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20.5 20.5-4.5-4.5" /></>,
  shop: <><path d="M4 7h16l-1.5 12.5a1 1 0 0 1-1 .9h-11a1 1 0 0 1-1-.9z" /><path d="M8.5 7V6a3.5 3.5 0 0 1 7 0v1" /></>,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8s2.5-5 4.5-5a2.5 2.5 0 0 1 0 5" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2.6l2.4 12.2a1 1 0 0 0 1 .8h9.4a1 1 0 0 0 1-.8L20.5 7H6" /></>,
  account: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></>,
  login: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
};
const Svg = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true">{Icon[name]}</svg>;

/** Navbar de l'espace client : recherche qui s'élargit + menu compte */
export default function ClientNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartCount();
  const [notif, setNotif] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const me = hydrated ? user : null;
  const isClient = me?.role === 'client';

  useEffect(() => {
    if (!isClient) return;
    let alive = true;
    api.get('/notifications/count').then(({ data }) => alive && setNotif(data.count)).catch(() => {});
    return () => {
      alive = false;
    };
  }, [isClient, pathname]);

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  function closeSearch() {
    setSearchOpen(false);
    setQ('');
  }

  function onSearch(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/products?q=${encodeURIComponent(term)}`);
    inputRef.current?.blur();
  }

  async function onLogout() {
    setMenuOpen(false);
    await logout();
    toast.success('Vous êtes déconnecté.');
    router.refresh();
  }

  const link = (href, label, icon, className, badge) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
      <li className={className}>
        <Link href={href} className={`cnav-link${active ? ' active' : ''}`}>
          <span className="cnav-icon">
            <Svg name={icon} />
            {badge > 0 && <b className="badge">{badge}</b>}
          </span>
          <span className="cnav-label">{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <header className={`cnav-wrap${searchOpen ? ' search-open' : ''}`}>
      <nav className="cnav" aria-label="Navigation principale">
        {/* shortcut: icône seule, site en français uniquement ; à brancher quand le multilingue arrivera */}
        <button type="button" className="cnav-lang" aria-label="Langue" title="Langue">
          <Svg name="language" />
        </button>

        <ul className="cnav-main">
          {link('/', 'Accueil', 'home', 'cnav-home')}
          <li className="cnav-search">
            <form role="search" onSubmit={onSearch}>
              <label className="cnav-searchbox">
                <Svg name="search" />
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Rechercher"
                  aria-label="Rechercher un produit"
                  autoComplete="off"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={closeSearch}
                  onKeyDown={(e) => e.key === 'Escape' && e.currentTarget.blur()}
                />
              </label>
            </form>
          </li>
          {link('/products', 'Produits', 'shop', 'cnav-products')}
          {link('/packs', 'Les Packs', 'gift', 'cnav-packs')}
          {link('/cart', 'Panier', 'cart', 'cnav-cart', hydrated ? cartCount : 0)}
        </ul>

        <div className="cnav-account" ref={menuRef} onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}>
          <button type="button" className="cnav-link cnav-account-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
            <span className="cnav-icon">
              {me?.image_url ? <Avatar src={me.image_url} name={me.name} className="cnav-photo" /> : <Svg name="account" />}
              {isClient && notif > 0 && <b className="badge">{notif}</b>}
            </span>
            <span className="cnav-label">Compte</span>
          </button>

          <div className={`cnav-menu${menuOpen ? ' open' : ''}`}>
            {me ? (
              <>
                <div className="cnav-user">
                  <Avatar src={me.image_url} name={me.name} className="cnav-avatar" />
                  <span className="cnav-email">{me.email}</span>
                </div>
                {isClient && (
                  <Link href="/profile" className="cnav-item" onClick={() => setMenuOpen(false)}>
                    <Svg name="account" /> Profil
                  </Link>
                )}
                <button type="button" className="cnav-item" onClick={onLogout}>
                  <Svg name="logout" /> Déconnexion
                </button>
              </>
            ) : (
              <Link href="/login" target="_blank" rel="noopener" className="cnav-item" onClick={() => setMenuOpen(false)}>
                <Svg name="login" /> Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
