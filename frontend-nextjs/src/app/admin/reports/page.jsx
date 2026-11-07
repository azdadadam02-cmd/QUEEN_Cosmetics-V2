'use client';
import { useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import { api, errorMessage } from '@/lib/api';
import { dateTime } from '@/lib/format';
import { toast } from '@/store/toastStore';

/** Lecture des reports envoyés par les clients */
export default function AdminReportsPage() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api.get('/admin/reports').then(({ data }) => setRows(data)).catch((e) => toast.error(errorMessage(e)));
  }, []);

  return (
    <>
      <PageHead title="Reports" note={rows ? `${rows.length} report${rows.length > 1 ? 's' : ''}` : ''} />
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Date</th><th>Client</th><th>Sujet</th><th>Message</th></tr></thead>
          <tbody>
            {!rows && <tr><td colSpan={4} className="empty-row">Chargement…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={4} className="empty-row">Aucun report pour le moment.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{dateTime(r.date)}</td>
                <td>{r.author}{r.email && <small>{r.email}</small>}</td>
                <td><strong>{r.subject}</strong></td>
                <td className="report-msg">{r.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
