import SiteLogo from '@/components/layout/SiteLogo';
import StaffShell from '@/components/layout/StaffShell';

export const metadata = { title: 'Gestion des packs' };

export default function Layout({ children }) {
  return <StaffShell roles={['responsable_produits']} logo={<SiteLogo />}>{children}</StaffShell>;
}
