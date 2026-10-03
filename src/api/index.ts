import { http } from './http';
import type { Health, TokenPair, User } from '@/types';

/**
 * Satu-satunya lapisan yang tahu endpoint BE. Alur wajib satu arah:
 * komponen -> hook (src/hooks) -> api.* (file ini) -> http.
 */
export const api = {
  health: () => http.get<Health>('/health'),

  // ── Auth ────────────────────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    http.post<{ user: User } & TokenPair>('/auth/login', { email, password }),
  me: () => http.get<User>('/auth/me'),
  /** Mencabut SEMUA token akun ini di BE (semua perangkat). */
  logout: () => http.post<null>('/auth/logout'),
  /** Mengembalikan pasangan token baru; sesi lain ikut dicabut. */
  changePassword: (currentPassword: string, newPassword: string) =>
    http.put<TokenPair>('/auth/password', { current_password: currentPassword, new_password: newPassword }),
};
