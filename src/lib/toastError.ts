import toast from 'react-hot-toast';
import { translateBeMessage } from './beMessage';

/**
 * Toast error generik untuk mutation. Interceptor di api/http.ts sudah
 * menimpa `err.message` dengan pesan dari BE; di sini diterjemahkan, dengan
 * `fallback` kalau tidak ada pesan sama sekali.
 */
export function toastMutationError(err: unknown, fallback: string) {
  const message = err instanceof Error ? err.message : undefined;
  toast.error(message ? translateBeMessage(message) : fallback);
}
