import { statusInfo } from '@/lib/format';

export default function StatusPill({ status }) {
  const s = statusInfo(status);
  return <span className={`pill pill-${s.cls}`}>{s.label}</span>;
}
