'use client';
import PageHead from '@/components/layout/PageHead';
import ProductsTable from '@/components/layout/ProductsTable';

export default function AdminProduitsPage() {
  return (
    <>
      <PageHead title="Produits & stock" note="Lecture seule — l'ajout et la modification sont faits par le responsable produits" />
      <ProductsTable />
    </>
  );
}
