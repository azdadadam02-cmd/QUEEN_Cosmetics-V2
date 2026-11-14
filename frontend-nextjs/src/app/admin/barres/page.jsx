'use client';
import { useCallback, useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import FormError from '@/components/ui/FormError';
import { api, errorMessage } from '@/lib/api';
import BrandForm from './BrandForm';
import PromoSection from './PromoSection';
import ServiceLinksForm from './ServiceLinksForm';
import UspSection from './UspSection';

export default function BarresPage() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(() => {
    api.get('/admin/top-bars').then(({ data: d }) => setData(d)).catch((e) => setLoadError(errorMessage(e)));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHead title="Barres du haut" note="Au-dessus de la navbar, côté client. Elles défilent avec la page." />
      <FormError message={loadError} />
      <UspSection usps={data?.usps} reload={load} />
      <PromoSection promos={data?.promos} reload={load} />
      {data && <BrandForm header={data.header} />}
      <ServiceLinksForm />
    </>
  );
}
