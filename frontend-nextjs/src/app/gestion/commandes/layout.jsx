import SiteLogo from '@/components/layout/SiteLogo';
import StaffShell from '@/components/layout/StaffShell';

export const metadata = { title: 'Gestion des commandes' };

export default function Layout({ children }) {
  return <StaffShell roles={['responsable_commandes']} logo={<SiteLogo />}>{children}</StaffShell>;
}
