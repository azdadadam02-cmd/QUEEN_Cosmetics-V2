'use client';
import OrdersTable from '@/components/layout/OrdersTable';
import PageHead from '@/components/layout/PageHead';

export default function AdminCommandesPage() {
  return (
    <>
      <PageHead eyebrow="Administration" title="Commandes" note="Lecture seule — le traitement est fait par le responsable commandes" />
      <OrdersTable readOnly />
    </>
  );
}
