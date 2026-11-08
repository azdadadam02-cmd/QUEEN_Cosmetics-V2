import { apiGet } from '@/lib/serverApi';
import TopBars from './TopBars';

export default async function TopBarsLoader() {
  const data = await apiGet('/top-bars').catch(() => null);
  if (!data || (!data.usps?.length && !data.promo && !data.brand)) return null;
  return <TopBars usps={data.usps} promo={data.promo} brand={data.brand} />;
}
