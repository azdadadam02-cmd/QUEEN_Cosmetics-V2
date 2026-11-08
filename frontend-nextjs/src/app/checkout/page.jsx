'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RequireRole from '@/components/layout/RequireRole';
import { api, errorMessage } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import CheckoutSummary from './CheckoutSummary';
import OrderLines from './OrderLines';
import ShippingFields from './ShippingFields';

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
  const order = useSubmit();
  const { errors, busy: sending, setError: setCheckError } = order;
  const [checked, setChecked] = useState(null);

  // Récapitulatif calculé par l'API (prix réels) ; sans lui, le bouton reste bloqué : l'erreur doit donc se voir
  useEffect(() => {
    const body = payload();
    if (!body.length) {
      router.replace('/cart');
      return;
    }
    api.post('/cart/check', { items: body })
      .then(({ data }) => {
        syncFromServer(data.lines);
        setChecked(data);
      })
      .catch((e) => setCheckError(errorMessage(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.majeur) {
      order.setErrors({ majeur: 'Vous devez confirmer avoir 18 ans ou plus pour passer commande.' });
      return;
    }
    order.run(() => api.post('/orders', { ...form, items: payload() }), () => {
      clear();
      router.push('/profile/orders');
    });
  }

  return (
    <>
      <div className="page-head">
        <h1 className="h-serif">Confirmation</h1>
        <p className="lead">Vous réglez en espèces à la réception de votre colis.</p>
      </div>

      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="stack">
          <ShippingFields form={form} set={set} errors={errors} />

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

          <OrderLines lines={checked?.lines || items} warnings={checked?.warnings} error={errors.items} />
        </div>

        <CheckoutSummary
          total={checked?.total ?? 0}
          adult={form.majeur}
          onAdult={set('majeur')}
          adultError={errors.majeur}
          error={order.error}
          sending={sending}
          ready={!!checked}
        />
      </form>
    </>
  );
}
