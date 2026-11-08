import { Suspense } from 'react';
import ProfileShell from './ProfileShell';

export const metadata = { title: 'Mon compte' };

export default function ProfileLayout({ children }) {
  return (
    <Suspense fallback={<div className="pf-shell" />}>
      <ProfileShell>{children}</ProfileShell>
    </Suspense>
  );
}
