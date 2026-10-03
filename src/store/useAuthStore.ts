import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TokenPair, User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (user: User, tokens: Pick<TokenPair, 'access_token' | 'refresh_token'>) => void;
  /** Ganti pasangan token (mis. setelah ganti kata sandi), user tetap. */
  setTokens: (tokens: Pick<TokenPair, 'access_token' | 'refresh_token'>) => void;
  /** Access token baru dari POST /auth/refresh (refresh token tetap). */
  setAccessToken: (token: string) => void;
  /** Data akun terbaru dari GET /auth/me (mis. nama/peran diubah admin). */
  setUser: (user: User) => void;
  clearSession: () => void;
}

/**
 * Satu-satunya sumber sesi login (JWT dari BE). Disimpan di localStorage
 * supaya bertahan saat tab ditutup; konsekuensinya script asing bisa
 * membacanya, karena itu CSP nginx hanya mengizinkan script dari origin
 * sendiri (nginx/default.conf.template). `RequireAuth` (App.tsx) dan
 * interceptor 401 (api/http.ts) bergantung pada store ini.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: (user, tokens) =>
        set({ user, accessToken: tokens.access_token, refreshToken: tokens.refresh_token }),
      setTokens: (tokens) => set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token }),
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'axon.auth.v1' },
  ),
);
