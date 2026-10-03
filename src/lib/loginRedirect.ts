// Kembali ke halaman semula setelah masuk: mis. tautan /kantor/1 dibuka saat
// sesi belum ada atau sudah berakhir. Tujuan dibawa di `?next=`.

export const LOGIN_PATH = '/masuk';

/** URL halaman masuk yang membawa `path` (pathname + search) sebagai tujuan. */
export function loginPathFor(path: string): string {
  return path && path !== '/' ? `${LOGIN_PATH}?next=${encodeURIComponent(path)}` : LOGIN_PATH;
}

/**
 * Tujuan dari `?next=` yang aman dipakai: hanya path internal. `//host` dan
 * URL absolut ditolak supaya tautan masuk tidak bisa dipakai untuk open
 * redirect ke situs lain.
 */
export function safeNextPath(next: string | null): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null;
  if (next.startsWith(LOGIN_PATH)) return null;
  return next;
}
