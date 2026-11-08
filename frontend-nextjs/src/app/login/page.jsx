'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthShell, { AuthField } from '@/components/layout/AuthShell';
import { errorMessage } from '@/lib/api';
import { homeFor, login, nextPath } from '@/lib/auth';
import { toast } from '@/store/toastStore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user, message } = await login(email, password);
      toast.success(message);
      const next = nextPath();
      router.push(user.role === 'client' ? next || '/' : homeFor(user));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Bon retour"
      subtitle="Connectez-vous pour retrouver vos favoris et vos commandes."
      bottom={<>Pas encore de compte ? <Link href="/register">Créer un compte</Link></>}
    >
      <form onSubmit={submit} className="login-form">
        <AuthField id="email" label="Adresse email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <AuthField id="password" label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        {error && <p className="error-text" role="alert">{error}</p>}
        <button type="submit" className="login-submit" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
      </form>
    </AuthShell>
  );
}
