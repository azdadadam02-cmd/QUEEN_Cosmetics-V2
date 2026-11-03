'use client';
import { useToastStore } from '@/store/toastStore';

export default function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => dismiss(t.id)}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
