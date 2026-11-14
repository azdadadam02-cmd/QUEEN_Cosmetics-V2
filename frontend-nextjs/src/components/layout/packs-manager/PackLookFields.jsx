import Field from '@/components/ui/Field';
import PackCard from '../PackCard';

/** Couleurs, texte du bouton, visibilité + aperçu de la carte telle qu'elle apparaîtra sur le site */
export default function PackLookFields({ form, set, errors }) {
  return (
    <fieldset className="form-group">
      <legend>Personnalisation de la carte</legend>
      <div className="row2">
        <Field id="couleur_fond" label="Couleur du bandeau" type="color" value={form.couleur_fond} onChange={set('couleur_fond')} error={errors.couleur_fond} />
        <Field id="couleur_texte" label="Couleur du texte" type="color" value={form.couleur_texte} onChange={set('couleur_texte')} error={errors.couleur_texte} />
      </div>
      <Field id="texte_bouton" label="Texte du bouton" hint="(ex : Voir le pack)" type="text" maxLength={40} value={form.texte_bouton} onChange={set('texte_bouton')} error={errors.texte_bouton} />
      <Field id="est_actif" error={errors.est_actif}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input id="est_actif" type="checkbox" checked={!!form.est_actif} onChange={set('est_actif')} /> Afficher sur le site
        </label>
      </Field>
      <div className="pack-preview" inert>
        <PackCard pack={{ id: 0, name: form.nom || 'Nom du pack', description: form.description, image_url: null, background: form.couleur_fond, color: form.couleur_texte, button: form.texte_bouton || 'Voir le pack' }} />
      </div>
    </fieldset>
  );
}
