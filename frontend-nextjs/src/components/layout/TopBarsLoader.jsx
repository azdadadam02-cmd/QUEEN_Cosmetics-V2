import { apiGet } from '@/lib/serverApi';
import TopBars from './TopBars';

export default async function TopBarsLoader() {
  // Les barres sont un bonus : si l'API est coupée ou pas migrée, le site s'affiche quand même
  const data = await apiGet('/top-bars').catch(() => null);
  if (!data || (!data.usps?.length && !data.promo && !data.brand)) return null;
  return <TopBars usps={data.usps} promo={data.promo} brand={data.brand} />;
}
