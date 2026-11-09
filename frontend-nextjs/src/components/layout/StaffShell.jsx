'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import { logout, ROLE_LABELS } from '@/lib/auth';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import RequireRole from './RequireRole';

// Tracés d'icônes (24×24, trait) : une par page
const ICONS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  layers: 'M12 2l10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5',
  clipboard: 'M9 3h6v3H9zM7 5H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2M8 11h8M8 15h5',
  wallet: 'M3 7a2 2 0 0 1 2-2h14v4M3 7v11a2 2 0 0 0 2 2h16V9H5a2 2 0 0 1-2-2zM16 14h2',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12',
  panel: 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM3 9h18',
  palette: 'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.5-1-1.5-1-3 0-1 1-2 2-2h3a3 3 0 0 0 3-3c0-4.5-4-8-9-8zM7.5 11h.01M10 7h.01M15 7h.01',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
};

const LINKS = {
  admin: [
    ['/admin', 'Tableau de bord', 'grid'],
    ['/admin/produits', 'Produits & stock', 'box'],
    ['/admin/packs', 'Packs', 'layers'],
    ['/admin/commandes', 'Commandes', 'clipboard'],
    ['/admin/finances', 'Finances', 'wallet'],
    ['/admin/publicites', 'Publicités', 'megaphone'],
    ['/admin/barres', 'Barres du haut', 'panel'],
    ['/admin/apparence', 'Apparence', 'palette'],
    ['/admin/avis', 'Avis', 'star'],
    ['/admin/reports', 'Reports', 'flag'],
    ['/admin/utilisateurs', 'Utilisateurs', 'users'],
  ],
  responsable_produits: [['/gestion/produits', 'Produits', 'box'], ['/gestion/packs', 'Packs', 'layers']],
  responsable_commandes: [['/gestion/commandes', 'Commandes', 'clipboard']],
};

const Icon = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[name]} /></svg>;

/** Espace du personnel : barre latérale sombre + contenu. Le cadre s'affiche tout de suite, la page attend le rôle (RequireRole). */
export default function StaffShell({ roles, logo, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const me = hydrated ? user : null;
  const links = (me && LINKS[me.role]) || [];

  async function onLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <div className="staff-shell">
      <aside className="staff-side">
        <Link href={me?.home || '/'} className="staff-brand" aria-label="QUEEN Cosmetics — mon espace">{logo}</Link>
        <nav className="staff-nav" aria-label="Espace personnel">
          {links.map(([href, label, icon]) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(`${href}/`));
            return <Link key={href} href={href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}><Icon name={icon} />{label}</Link>;
          })}
        </nav>
        {me && (
          <div className="staff-user">
            <Avatar src={me.image_url} name={me.name} />
            <span><strong>{me.name}</strong><small>{ROLE_LABELS[me.role]}</small></span>
            <button type="button" className="staff-logout" onClick={onLogout} aria-label="Déconnexion" title="Déconnexion"><Icon name="logout" /></button>
          </div>
        )}
      </aside>
      <div className="staff-main">
        <RequireRole roles={roles}><div className="staff">{children}</div></RequireRole>
      </div>
    </div>
  );
}
