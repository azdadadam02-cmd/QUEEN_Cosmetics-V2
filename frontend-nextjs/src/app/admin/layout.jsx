import RequireRole from '@/components/layout/RequireRole';
import StaffTabs from '@/components/layout/StaffTabs';

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
