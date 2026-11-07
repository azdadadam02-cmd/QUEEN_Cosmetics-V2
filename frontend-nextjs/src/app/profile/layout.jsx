import { Suspense } from 'react';
import ProfileShell from './ProfileShell';

export const metadata = { title: 'Mon compte' };

/** Espace compte : sans navbar ni barres du haut, on en sort par Home ou le logo */
export default function ProfileLayout({ children }) {
  return (
    <Suspense fallback={<div className="pf-shell" />}>
      <ProfileShell>{children}</ProfileShell>
    </Suspense>
  );
}
