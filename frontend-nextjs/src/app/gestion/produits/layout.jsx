import RequireRole from '@/components/layout/RequireRole';

export const metadata = { title: 'Gestion des produits' };

export default function Layout({ children }) {
  return <RequireRole roles={['responsable_produits']}><div className="staff">{children}</div></RequireRole>;
}
