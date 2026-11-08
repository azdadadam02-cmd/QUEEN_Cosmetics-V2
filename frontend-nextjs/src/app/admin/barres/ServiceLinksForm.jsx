'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import { api, errorMessage } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';

const FIELDS = [
  ['whatsapp', 'WhatsApp', '(https://wa.me/212612345678)', 'url'],
  ['facebook', 'Facebook', '(https://facebook.com/…)', 'url'],
  ['instagram', 'Instagram', '(https://instagram.com/…)', 'url'],
  ['twitter', 'Twitter / X', '(https://x.com/…)', 'url'],
  ['gmail', 'Gmail', '(adresse e-mail)', 'email'],
];

export default function ServiceLinksForm() {
  const submit = useSubmit();
  const { errors, setError: setLoadError } = submit;
  const [links, setLinks] = useState(null);

  useEffect(() => {
    api.get('/service-links')
      .then(({ data }) => setLinks(Object.fromEntries(FIELDS.map(([k]) => [k, data[k] || '']))))
      .catch((e) => setLoadError(errorMessage(e)));
  }, [setLoadError]);

  const set = (k) => (e) => setLinks((l) => ({ ...l, [k]: e.target.value }));

  function onSubmit(e) {
    e.preventDefault();
    submit.run(() => api.put('/admin/service-links', Object.fromEntries(Object.entries(links).map(([k, v]) => [k, v.trim() || null]))));
  }

  return (
    <>
      <h2 className="h-serif" style={{ margin: '36px 0 14px' }}>Liens Service (profil client)</h2>
      <p className="muted" style={{ marginBottom: 14 }}>Un lien vide n&apos;est pas affiché dans le profil.</p>
      {!links && <FormError message={submit.error} />}
      {links && (
        <form className="panel" onSubmit={onSubmit} noValidate style={{ padding: 22, maxWidth: 520 }}>
          {FIELDS.map(([k, label, hint, type]) => (
            <Field key={k} id={`l_${k}`} label={label} hint={hint} type={type} value={links[k]} onChange={set(k)} error={errors[k]} />
          ))}
          <FormError message={submit.error} success={submit.success} />
          <Button type="submit" size="sm" loading={submit.busy}>Enregistrer</Button>
        </form>
      )}
    </>
  );
}
