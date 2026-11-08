export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function apiGet(path) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return res.json();
}
