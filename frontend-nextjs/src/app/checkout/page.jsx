'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RequireRole from '@/components/layout/RequireRole';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Thumb from '@/components/ui/Thumb';
import VariantTag from '@/components/ui/VariantTag';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { money } from '@/lib/format';
import { useAuthStore } from '@/store/authStore';
import { lineKey, useCartStore } from '@/store/cartStore';
import { toast } from '@/store/toastStore';

export default function CheckoutPage() {
  return (
    <RequireRole roles={['client']}>
      <Checkout />
    </RequireRole>
  );
}

/** Confirmation : paiement à la livraison + adresse + case « +18 » (revérifiée par Laravel) */
function Checkout() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { items, payload, clear, syncFromServer } = useCartStore();
  const [form, setForm] = useState({ nom: user?.name || '', telephone: '', ville: '', adresse: '', majeur: false });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [lines, setLines] = useState(null);

  // Récapitulatif calculé par l'API (prix réels)
  useEffect(() => {
    const body = payload();
    if (!body.length) {
      toast.info('Votre panier est vide.');
      router.replace('/cart');
      return;
    }
    api.post('/cart/check', { items: body }).then(({ data }) => {
      data.warnings.forEach((w) => toast.info(w));
      syncFromServer(data.lines);
      setLines(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.majeur) {
      setErrors({ majeur: 'Vous devez confirmer avoir 18 ans ou plus pour passer commande.' });
      return;
    }
    setSending(true);
    setErrors({});
    try {
      const { data } = await api.post('/orders', { ...form, items: payload() });
      clear();
      toast.success(data.message);
      router.push('/profile/orders');
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1 className="h-serif">Confirmation</h1>
        <p className="lead">Vous réglez en espèces à la réception de votre colis.</p>
      </div>

      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="stack">
          <section className="panel">
            <h3>Adresse de livraison</h3>
            <div className="ship-form">
              <Field id="nom" label="Nom du destinataire" value={form.nom} onChange={set('nom')} error={errors.nom} type="text" autoComplete="name" required />
              <div className="row2">
                <Field id="telephone" label="Téléphone" hint="(ex : 06 12 34 56 78)" value={form.telephone} onChange={set('telephone')} error={errors.telephone} type="tel" autoComplete="tel" required />
                <Field id="ville" label="Ville" value={form.ville} onChange={set('ville')} error={errors.ville} type="text" autoComplete="address-level2" required />
              </div>
              <Field id="adresse" label="Adresse complète" hint="(rue, n°, quartier)" as="textarea" value={form.adresse} onChange={set('adresse')} error={errors.adresse} required />
              <p className="hint">Le livreur vous appellera avant de passer.</p>
            </div>
          </section>

          <section className="panel">
            <h3>Paiement</h3>
            <label className="pay selected">
              <input type="radio" checked readOnly />
              <span className="pay-ico">
                <svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /></svg>
              </span>
              <span className="pay-txt"><strong>Paiement à la livraison</strong><small>En espèces, à la remise du colis</small></span>
              <span className="pay-check">✓</span>
            </label>
          </section>

          <section className="panel">
            <h3>Articles</h3>
            {(lines?.lines || items).map((l) => (
              <div className="mini-line" key={lineKey(l)}>
                <Thumb src={l.image_url} name={l.name} size="sm" />
                <div className="ml-info"><strong>{l.name}</strong><VariantTag color={l.variant_color} size={l.variant_size} /><small>{l.quantity} × {money(l.price)}</small></div>
                <span className="ml-total">{money(l.price * l.quantity)}</span>
              </div>
            ))}
            {errors.items && <p className="error-text">{errors.items}</p>}
          </section>
        </div>

        <aside className="summary">
          <h3 className="h-serif">Total à payer</h3>
          <div className="total"><span>À la livraison</span><strong>{money(lines?.total ?? 0)}</strong></div>
          <label className="check">
            <input type="checkbox" checked={form.majeur} onChange={set('majeur')} />
            <span className="box" />
            <span className="check-txt"><b>+18</b>Je confirme avoir 18 ans ou plus.</span>
          </label>
          {errors.majeur && <span className="error-text" style={{ color: '#ffb4ab' }}>{errors.majeur}</span>}
          <Button type="submit" block loading={sending} disabled={!lines || sending}>
            {sending ? 'Envoi…' : 'Valider ma commande'}
          </Button>
        </aside>
      </form>
    </>
  );
}
