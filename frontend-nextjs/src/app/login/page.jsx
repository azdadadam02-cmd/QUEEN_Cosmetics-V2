'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { errorMessage } from '@/lib/api';
import { homeFor, login } from '@/lib/auth';
import { toast } from '@/store/toastStore';

/** Lit ?next=/checkout en n'acceptant QUE des chemins internes (pas de redirection ouverte) */
function nextPath() {
  const n = new URLSearchParams(window.location.search).get('next');
  return n && n.startsWith('/') && !n.startsWith('//') ? n : null;
}

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
    <div className="auth-wrap">
      <div className="auth-card">
        <span className="eyebrow">Espace QUEEN</span>
        <h1 className="h-serif">Connexion</h1>
        <form onSubmit={submit}>
          <Field id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <Field id="password" label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" block loading={loading}>{loading ? 'Connexion…' : 'Se connecter'}</Button>
        </form>
        <p className="switch">Pas encore de compte ? <Link href="/register">Créer un compte</Link></p>
      </div>
    </div>
  );
}
