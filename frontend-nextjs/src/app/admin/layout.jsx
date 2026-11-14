import SiteLogo from '@/components/layout/SiteLogo';
import StaffShell from '@/components/layout/StaffShell';

export default function AdminLayout({ children }) {
  return <StaffShell roles={['admin']} logo={<SiteLogo />}>{children}</StaffShell>;
}
