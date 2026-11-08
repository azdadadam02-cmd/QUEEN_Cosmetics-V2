'use client';
import OrdersTable from '@/components/layout/OrdersTable';
import PageHead from '@/components/layout/PageHead';

export default function GestionCommandesPage() {
  return (
    <>
      <PageHead title="Gestion des commandes" />
      <OrdersTable />
    </>
  );
}
