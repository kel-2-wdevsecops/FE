import type { AxiosError } from 'axios';

interface ValidationEnvelope {
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Error per field dari respons validasi BE (status 422, `body.errors` — key-nya
 * path Zod digabung titik, lihat error.middleware.ts di BE). Dipakai di form
 * untuk highlight input yang gagal, terpisah dari toast pesan umum.
 */
export function getFieldErrors(err: unknown): Record<string, string> {
  const axiosErr = err as AxiosError<ValidationEnvelope> | null | undefined;
  return axiosErr?.response?.status === 422 ? (axiosErr.response.data?.errors ?? {}) : {};
}

/** Border merah dipakai konsisten di semua input yang lagi menampilkan error field. */
export const errorInputClass = 'border-red-400 focus:border-red-400';
