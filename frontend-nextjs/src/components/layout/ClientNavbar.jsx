'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useHydrated, useLayoutPathname } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import { useCartCount } from '@/store/cartStore';
import AccountMenu from './navbar/AccountMenu';
import NavIcon from './navbar/NavIcon';
import NavSearch from './navbar/NavSearch';

function NavLink({ href, label, icon, className, badge, pathname }) {
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return (
    <li className={className}>
      <Link href={href} className={`cnav-link${active ? ' active' : ''}`}>
        <span className="cnav-icon">
          <NavIcon name={icon} />
          {badge > 0 && <b className="badge">{badge}</b>}
        </span>
        <span className="cnav-label">{label}</span>
      </Link>
    </li>
  );
}

export default function ClientNavbar() {
  const pathname = useLayoutPathname();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartCount();
  const [searchOpen, setSearchOpen] = useState(false);
  const me = hydrated ? user : null;

  return (
    <header className={`cnav-wrap${searchOpen ? ' search-open' : ''}`}>
      <nav className="cnav" aria-label="Navigation principale">
        {/* shortcut: icône seule, site en français uniquement ; à brancher quand le multilingue arrivera */}
        <button type="button" className="cnav-lang" aria-label="Langue" title="Langue">
          <NavIcon name="language" />
        </button>

        <ul className="cnav-main">
          <NavLink href="/" label="Accueil" icon="home" className="cnav-home" pathname={pathname} />
          <li className="cnav-search"><NavSearch onOpenChange={setSearchOpen} /></li>
          <NavLink href="/products" label="Produits" icon="shop" className="cnav-products" pathname={pathname} />
          <NavLink href="/packs" label="Les Packs" icon="gift" className="cnav-packs" pathname={pathname} />
          <NavLink href="/cart" label="Panier" icon="cart" className="cnav-cart" badge={hydrated ? cartCount : 0} pathname={pathname} />
        </ul>

        <AccountMenu me={me} pathname={pathname} />
      </nav>
    </header>
  );
}
