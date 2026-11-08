import Field from '@/components/ui/Field';

export default function ShippingFields({ form, set, errors }) {
  return (
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
  );
}
