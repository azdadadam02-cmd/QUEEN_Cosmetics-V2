'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthShell, { AuthField } from '@/components/layout/AuthShell';
import { errorMessage, fieldErrors } from '@/lib/api';
import { register } from '@/lib/auth';
import { toast } from '@/store/toastStore';

/** Inscription : crée un compte client et connecte directement (comme avant) */
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nom: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const { message } = await register(form);
      toast.success(message);
      router.push('/');
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors(Object.keys(fe).length ? fe : { global: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Rejoignez QUEEN pour commander et garder vos favoris."
      bottom={<>Déjà inscrit ? <Link href="/login">Se connecter</Link></>}
    >
      <form onSubmit={submit} className="login-form">
        <AuthField id="nom" label="Nom complet" value={form.nom} onChange={set('nom')} error={errors.nom} autoComplete="name" required />
        <AuthField id="email" label="Adresse email" type="email" placeholder="votre@email.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" required />
        <AuthField id="password" label="Mot de passe" hint="(8 caractères min., 1 majuscule)" type="password" value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" required />
        <AuthField id="password_confirmation" label="Confirmer le mot de passe" type="password" value={form.password_confirmation} onChange={set('password_confirmation')} autoComplete="new-password" required />
        {errors.global && <p className="error-text" role="alert">{errors.global}</p>}
        <button type="submit" className="login-submit" disabled={loading}>{loading ? 'Création…' : 'Créer mon compte'}</button>
      </form>
    </AuthShell>
  );
}
