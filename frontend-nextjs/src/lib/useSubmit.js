'use client';
import { useState } from 'react';
import { errorMessage, fieldErrors } from '@/lib/api';
import { toast } from '@/store/toastStore';

/**
 * Envoi d'un formulaire ou d'une action vers l'API.
 * errors : erreurs par champ (sous chaque input). error : message général, quand aucun champ ne l'explique.
 * success : message de l'API après réussite. Les toasts ne s'affichent plus : ce sont les seuls retours visibles.
 */
export function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function run(request, onSuccess) {
    setBusy(true);
    setErrors({});
    setError('');
    setSuccess('');
    let data;
    try {
      ({ data } = await request());
    } catch (err) {
      const fields = fieldErrors(err);
      setErrors(fields);
      if (!Object.keys(fields).length) setError(errorMessage(err));
      toast.error(errorMessage(err));
      return null;
    } finally {
      setBusy(false);
    }
    toast.success(data?.message);
    setSuccess(data?.message || '');
    onSuccess?.(data);
    return data;
  }

  function reset() {
    setErrors({});
    setError('');
    setSuccess('');
  }

  return { busy, errors, error, success, run, reset, setErrors, setError };
}
