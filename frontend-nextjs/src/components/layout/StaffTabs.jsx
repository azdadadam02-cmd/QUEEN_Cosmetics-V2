'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const TABS = {
  admin: [
    ['/admin', 'Tableau de bord'],
    ['/admin/produits', 'Produits & stock'],
    ['/admin/packs', 'Packs'],
    ['/admin/commandes', 'Commandes'],
    ['/admin/finances', 'Finances'],
    ['/admin/publicites', 'Publicités'],
    ['/admin/barres', 'Barres du haut'],
    ['/admin/apparence', 'Apparence'],
    ['/admin/avis', 'Avis'],
    ['/admin/reports', 'Reports'],
    ['/admin/utilisateurs', 'Utilisateurs'],
  ],
  responsable_produits: [['/gestion/produits', 'Produits'], ['/gestion/packs', 'Packs']],
  responsable_commandes: [['/gestion/commandes', 'Commandes']],
};

export default function StaffTabs() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);
  const tabs = TABS[role] || [];
  if (tabs.length < 2) return null;
  return (
    <nav className="staff-tabs" aria-label="Espace personnel">
      {tabs.map(([href, label]) => (
        <Link key={href} href={href} className={pathname === href ? 'active' : ''}>{label}</Link>
      ))}
    </nav>
  );
}
