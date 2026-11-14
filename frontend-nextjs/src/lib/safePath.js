/**
 * Chemin interne sûr pour une redirection (?next=…), sinon null.
 * On laisse le navigateur résoudre l'URL puis on compare l'origine : « //site », « /\site », « \/site »,
 * « javascript: » ou un domaine encodé sortent tous du site et sont refusés (pas de redirection ouverte).
 */
export function safeInternalPath(raw, origin) {
  if (typeof raw !== 'string' || !raw.startsWith('/')) return null;
  try {
    const url = new URL(raw, origin);
    return url.origin === origin ? url.pathname + url.search + url.hash : null;
  } catch {
    return null;
  }
}
