import { fetchPage, http, type ApiMeta } from './http';
import type { Health, Office, OfficeInput, TokenPair, User, UserInput } from '@/types';

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

  // ── Users (admin) ───────────────────────────────────────────────────────────
  listUsersPage: (params: { page: number; search?: string }): Promise<{ data: User[]; meta: ApiMeta }> =>
    fetchPage<User>('/users', { page: params.page, per_page: 20, search: params.search }),
  getUser: (id: string) => http.get<User>(`/users/${id}`),
  createUser: (input: UserInput) => http.post<User>('/users', input),
  /** `password` diisi = reset kata sandi oleh admin; semua sesi akun itu dicabut BE. */
  updateUser: (id: string, patch: Partial<UserInput>) => http.put<User>(`/users/${id}`, patch),
  deleteUser: (id: string) => http.del<null>(`/users/${id}`),

  // ── Offices ─────────────────────────────────────────────────────────────────
  // Kunci kantor = officeCode (string bebas), jadi selalu di-encode di path.
  listOfficesPage: (params: { page: number; search?: string }): Promise<{ data: Office[]; meta: ApiMeta }> =>
    fetchPage<Office>('/offices', { page: params.page, per_page: 20, search: params.search }),
  getOffice: (code: string) => http.get<Office>(`/offices/${encodeURIComponent(code)}`),
  createOffice: (input: OfficeInput) => http.post<Office>('/offices', input),
  /** Kode kantor tidak bisa diubah (dirujuk karyawan), jadi tidak ikut dikirim. */
  updateOffice: (code: string, patch: Partial<Omit<OfficeInput, 'officeCode'>>) =>
    http.put<Office>(`/offices/${encodeURIComponent(code)}`, patch),
  deleteOffice: (code: string) => http.del<null>(`/offices/${encodeURIComponent(code)}`),
};
