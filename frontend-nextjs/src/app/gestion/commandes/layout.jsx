import RequireRole from '@/components/layout/RequireRole';

export const metadata = { title: 'Gestion des commandes' };

export default function Layout({ children }) {
  return <RequireRole roles={['responsable_commandes']}><div className="staff">{children}</div></RequireRole>;
}
