'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import { api, errorMessage } from '@/lib/api';
import { money } from '@/lib/format';
import { toast } from '@/store/toastStore';

/** Tableau de bord de l'admin */
export default function AdminDashboard() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setD(data)).catch((e) => toast.error(errorMessage(e)));
  }, []);

  if (!d) return <p className="loading-line">Chargement…</p>;
  const o = d.orders || {};
  return (
    <>
      <PageHead title="Tableau de bord" />
      <div className="stats">
        <div className="stat gold"><span className="stat-label">Encaissé</span><strong>{money(d.finance.encaisse)}</strong><small>dont {money(d.finance.mois)} ce mois</small></div>
        <div className="stat"><span className="stat-label">À encaisser</span><strong>{money(d.finance.a_encaisser)}</strong><small>commandes acceptées</small></div>
        <div className="stat"><span className="stat-label">Commandes</span><strong>{d.orders_total}</strong><small>{o['En attente'] || 0} en attente · {o.Acceptee || 0} acceptées · {o.Livree || 0} livrées</small></div>
        <div className="stat"><span className="stat-label">Utilisateurs</span><strong>{d.users_total}</strong><small>{d.roles.client || 0} clients · {(d.roles.responsable_produits || 0) + (d.roles.responsable_commandes || 0)} responsables</small></div>
        <div className="stat"><span className="stat-label">Produits</span><strong>{d.products.total}</strong><small>{d.products.unites} unités en stock</small></div>
        <div className="stat warn"><span className="stat-label">Alertes stock</span><strong>{d.products.rupture + d.products.faible}</strong><small>{d.products.rupture} en rupture · {d.products.faible} faibles</small></div>
      </div>
      <div className="shortcuts">
        <Link className="short" href="/admin/finances"><b>Finances</b><span>Paiements encaissés et à encaisser</span></Link>
        <Link className="short" href="/admin/publicites"><b>Publicités</b><span>Carrousel de l&apos;accueil et promotions</span></Link>
        <Link className="short" href="/admin/utilisateurs"><b>Utilisateurs</b><span>Clients et responsables</span></Link>
      </div>
    </>
  );
}
