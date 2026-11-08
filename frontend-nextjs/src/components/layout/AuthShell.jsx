'use client';
import { useState } from 'react';

/** Cadre commun connexion / inscription : photo à gauche, carte du formulaire à droite (sous la navbar, avant le footer) */
export default function AuthShell({ title, subtitle, children, bottom }) {
  return (
    <div className="login-split">
      {/* Photo : public/images/login.png (à côté du logo) */}
      <div className="login-art" aria-hidden="true" />

      <div className="login-pane">
        <div className="login-card">
          <h1>{title}</h1>
          <p className="login-sub">{subtitle}</p>
          {children}
          <p className="login-switch">{bottom}</p>
        </div>
      </div>
    </div>
  );
}

/** Champ du formulaire : étiquette, saisie, erreur ; un mot de passe a son bouton « œil » */
export function AuthField({ id, label, hint, type = 'text', error, ...props }) {
  const [show, setShow] = useState(false);
  const pass = type === 'password';
  const input = <input id={id} type={pass && show ? 'text' : type} aria-invalid={!!error} {...props} />;

  return (
    <>
      <label htmlFor={id}>{label}{hint && <small> {hint}</small>}</label>
      {pass ? (
        <div className="login-pass">
          {input}
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={show}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
              {show && <path d="m3 3 18 18" />}
            </svg>
          </button>
        </div>
      ) : input}
      {error && <span className="error-text">{error}</span>}
    </>
  );
}
