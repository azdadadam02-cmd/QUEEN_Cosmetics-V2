'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { homeFor, isStaffPath, logout, refreshMe, ROLE_LABELS } from '@/lib/auth';
import Avatar from '@/components/ui/Avatar';
import { useHydrated, useLayoutPathname } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';
import ClientNavbar from './ClientNavbar';

/** Espace client → ClientNavbar ; espaces de gestion → StaffNavbar. Le personnel n'a pas accès à l'espace client. */
export default function Navbar({ logo }) {
  const pathname = useLayoutPathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const isStaffUser = hydrated && !!user && user.role !== 'client';
  const blocked = isStaffUser && !isStaffPath(pathname);

  // Rôle relu en base au chargement (comme l'ancien site à chaque requête)
  useEffect(() => {
    refreshMe();
  }, []);

  useEffect(() => {
    if (blocked) router.replace(homeFor(user));
  }, [blocked, user, router]);

  return (
    <>
      {/* Masqué ici car envelopper children avec usePathname exigerait un Suspense sur tout le site (cacheComponents) */}
      {blocked && <style>{'main,.site-footer,.usp-bar,.promo-bar,.brand-bar{visibility:hidden}'}</style>}
      {isStaffUser || isStaffPath(pathname) ? <StaffNavbar logo={logo} /> : <ClientNavbar />}
    </>
  );
}

function StaffNavbar({ logo }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const me = hydrated ? user : null;

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

  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Navigation principale">
        <Link href={homeFor(me)} className="brand" aria-label="QUEEN Cosmetics — mon espace">
          {logo}
        </Link>
        <span />

        <div className="nav-actions">
          {me && me.role !== 'client' && (
            <Link href={me.home} className="staff-link">Espace {ROLE_LABELS[me.role]?.toLowerCase()}</Link>
          )}
          {me ? (
            <div className={`profile${open ? ' open' : ''}`} ref={menuRef}>
              <button type="button" className="profile-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                <Avatar src={me.image_url} name={me.name} />
                <span className="profile-email">{me.email}</span>
                <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div className="profile-menu">
                <div className="pm-head">
                  <Avatar src={me.image_url} name={me.name} className="avatar lg" />
                  <div>
                    <strong>{me.name}</strong>
                    <small>{me.email}</small>
                    <small>{ROLE_LABELS[me.role]}</small>
                  </div>
                </div>
                <button type="button" className="pm-item danger" onClick={onLogout}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 16l-4-4 4-4M6 12h10" /></svg> Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" target="_blank" rel="noopener" className="btn btn-gold btn-sm">Connexion</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export function NavbarFallback() {
  return (
    <header className="cnav-wrap">
      <nav className="cnav" aria-label="Navigation principale" />
    </header>
  );
}
