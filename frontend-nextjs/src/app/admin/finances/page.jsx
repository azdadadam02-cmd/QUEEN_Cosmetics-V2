'use client';
import { useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import FormError from '@/components/ui/FormError';
import StatusPill from '@/components/ui/StatusPill';
import { api, errorMessage } from '@/lib/api';
import { dateTime, money } from '@/lib/format';

const FILTERS = [['', 'Tous'], ['paye', 'Encaissés'], ['encaisser', 'À encaisser']];

/** Finances : l'argent est encaissé uniquement à la livraison */
export default function FinancesPage() {
  const [filter, setFilter] = useState('');
  const [d, setD] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api
      .get('/admin/finances', { params: filter ? { filter } : {} })
      .then(({ data }) => setD(data))
      .catch((e) => setLoadError(errorMessage(e)));
  }, [filter]);

  if (!d) return <p className="loading-line">Chargement…</p>;
  const s = d.summary;
  const max = Math.max(1, ...d.days.map((x) => x.amount));

  return (
    <>
      <PageHead title="Finances" note="Paiement à la livraison : l'argent est encaissé quand la commande est livrée" />
      <FormError message={loadError} />
      <div className="stats">
        <div className="stat gold"><span className="stat-label">Total encaissé</span><strong>{money(s.encaisse)}</strong><small>{s.nb_payes} commande(s) payée(s)</small></div>
        <div className="stat"><span className="stat-label">Encaissé ce mois</span><strong>{money(s.mois)}</strong><small>panier moyen {money(s.panier_moyen)}</small></div>
        <div className="stat"><span className="stat-label">À encaisser</span><strong>{money(s.a_encaisser)}</strong><small>commandes acceptées</small></div>
        <div className="stat"><span className="stat-label">En attente</span><strong>{money(s.en_attente)}</strong><small>pas encore validées</small></div>
        <div className="stat warn"><span className="stat-label">Refusé / annulé</span><strong>{money(s.refuse)}</strong><small>non encaissé</small></div>
      </div>

      <section className="panel chart-panel">
        <div className="chart-head"><h3>Encaissé — 14 derniers jours</h3></div>
        <div className="bars">
          {d.days.map((x) => {
            const dt = new Date(x.day + 'T12:00:00');
            return (
              <div key={x.day} className={`bar${x.amount > 0 ? ' has' : ''}`} title={`${x.day} : ${money(x.amount)} (${x.count})`}>
                <span className="bar-val">{x.amount > 0 ? Math.round(x.amount) : ''}</span>
                <span className="bar-fill" style={{ height: `${Math.max(3, (x.amount / max) * 100)}%` }} />
                <span className="bar-day">{dt.toLocaleDateString('fr-FR', { weekday: 'short' })}<br /><small>{dt.getDate()}</small></span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="chips">
        {FILTERS.map(([k, label]) => (
          <button key={k} type="button" className={`chip${filter === k ? ' active' : ''}`} onClick={() => setFilter(k)}>{label}</button>
        ))}
      </div>
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Commande</th><th>Client</th><th>Date</th><th>Statut</th><th>Paiement</th><th className="num">Montant</th></tr></thead>
          <tbody>
            {d.payments.length === 0 && <tr><td colSpan={6} className="empty-row">Aucun paiement.</td></tr>}
            {d.payments.map((p) => (
              <tr key={p.id}>
                <td><strong>#{p.order_id}</strong><small>{p.method}</small></td>
                <td>{p.client.name}<small>{p.client.email}</small></td>
                <td>{dateTime(p.date)}</td>
                <td><StatusPill status={p.order_status} /></td>
                <td>
                  {p.payment_status === 'Paye' ? <span className="pay-state paid">Payé</span>
                    : p.order_status === 'Refusee' ? <span className="pill pill-refusee">Annulé</span>
                    : <span className="pay-state">À encaisser</span>}
                </td>
                <td className="num"><strong>{money(p.amount)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
