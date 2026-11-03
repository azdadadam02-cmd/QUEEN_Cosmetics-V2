import RequireRole from '@/components/layout/RequireRole';
import StaffTabs from '@/components/layout/StaffTabs';

/** Toutes les pages /admin/... : réservées au rôle admin */
export default function AdminLayout({ children }) {
  return (
    <RequireRole roles={['admin']}>
      <div className="staff">
        <StaffTabs />
        {children}
      </div>
    </RequireRole>
  );
}
