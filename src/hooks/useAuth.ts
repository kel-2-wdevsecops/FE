import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '@/api';
import { queryKeys } from '@/api/queryKeys';
import { LOGIN_PATH } from '@/lib/loginRedirect';
import { toastMutationError } from '@/lib/toastError';
import { useAuthStore } from '@/store/useAuthStore';

/** Masuk dengan email + kata sandi; sesi disimpan di useAuthStore. Error ditampilkan form, bukan toast. */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => api.login(email, password),
    onSuccess: ({ user, ...tokens }) => setSession(user, tokens),
  });
}

/**
 * Keluar: BE mencabut semua token akun ini, lalu sesi lokal dihapus. Sesi
 * lokal tetap dihapus walau request gagal (mis. jaringan putus), supaya
 * tombol Keluar selalu berhasil dari sisi pengguna.
 */
export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: api.logout,
    onSettled: () => {
      clearSession();
      qc.clear();
      navigate(LOGIN_PATH, { replace: true });
      toast.success('Berhasil keluar');
    },
  });
}

/**
 * Menyegarkan data akun dari GET /auth/me setiap kali ruang kerja dibuka,
 * supaya perubahan nama/peran oleh admin langsung terlihat (dan menu admin
 * hilang kalau peran diturunkan).
 */
export function useSyncCurrentUser() {
  const hasToken = useAuthStore((s) => Boolean(s.accessToken));
  const setUser = useAuthStore((s) => s.setUser);
  const me = useQuery({ queryKey: queryKeys.me, queryFn: api.me, enabled: hasToken });
  useEffect(() => {
    if (me.data) setUser(me.data);
  }, [me.data, setUser]);
}

/** Ganti kata sandi. BE mencabut sesi lain dan memberi pasangan token baru untuk sesi ini. */
export function useChangePassword() {
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: ({ current, next }: { current: string; next: string }) => api.changePassword(current, next),
    onSuccess: (tokens) => {
      setTokens(tokens);
      toast.success('Kata sandi diganti. Sesi di perangkat lain sudah dikeluarkan.');
    },
    onError: (err) => toastMutationError(err, 'Gagal mengganti kata sandi'),
  });
}
