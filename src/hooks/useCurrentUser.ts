import { useAuthStore } from '@/store/useAuthStore';

/** Akun yang sedang masuk (null di halaman publik). */
export const useCurrentUser = () => useAuthStore((s) => s.user);

/**
 * Menyembunyikan tombol/menu khusus admin. Hanya kenyamanan tampilan: BE
 * tetap menolak (403) aksi admin dari akun staf.
 */
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === 'admin');
