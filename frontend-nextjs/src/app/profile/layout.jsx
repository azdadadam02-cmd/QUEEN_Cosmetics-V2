import { Suspense } from 'react';
import SiteLogo from '@/components/layout/SiteLogo';
import ProfileShell from './ProfileShell';

export const metadata = { title: 'Mon compte' };

export default function ProfileLayout({ children }) {
  return (
    <Suspense fallback={<div className="pf-shell" />}>
      <ProfileShell logo={<SiteLogo />}>{children}</ProfileShell>
    </Suspense>
  );
}
