import RequireRole from '@/components/layout/RequireRole';
import StaffTabs from '@/components/layout/StaffTabs';

export const metadata = { title: 'Gestion des packs' };

export default function Layout({ children }) {
  return <RequireRole roles={['responsable_produits']}><div className="staff"><StaffTabs />{children}</div></RequireRole>;
}
