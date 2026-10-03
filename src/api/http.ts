import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { LOGIN_PATH, loginPathFor } from '@/lib/loginRedirect';
import { useAuthStore } from '@/store/useAuthStore';

/** Prefix API. Default origin yang sama (dev: proxy Vite, produksi: proxy nginx). */
export const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/** `meta` pada respons list ber-paginasi (lihat buildMeta di BE). */
export interface ApiMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

/** Amplop semua respons BE (ApiResponse di BE). */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string>;
  meta?: ApiMeta;
}

export const client = axios.create({ baseURL: BASE_URL, timeout: 15_000 });

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoint yang 401-nya berarti "kredensial salah", bukan "sesi habis".
const isAuthEndpoint = (url?: string) => url === '/auth/login' || url === '/auth/refresh';

// Satu refresh untuk semua request yang gagal bersamaan: tanpa ini, lima
// request paralel yang kena 401 memanggil /auth/refresh lima kali.
let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error('Tidak ada refresh token.');
  // axios polos, bukan `client`, supaya tidak masuk interceptor ini lagi.
  const res = await axios.post<ApiEnvelope<{ access_token: string }>>(`${BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  const token = res.data.data?.access_token;
  if (!token) throw new Error('Refresh gagal.');
  useAuthStore.getState().setAccessToken(token);
  return token;
}

let sessionEnding = false;

/** Sesi tidak bisa dipulihkan: hapus, beri tahu sekali, kembali ke halaman masuk. */
function endSession() {
  useAuthStore.getState().clearSession();
  if (sessionEnding || globalThis.location.pathname === LOGIN_PATH) return;
  sessionEnding = true;
  toast.error('Sesi berakhir. Silakan masuk kembali.');
  const back = globalThis.location.pathname + globalThis.location.search;
  // Muat ulang penuh: cache react-query milik sesi lama ikut terbuang.
  setTimeout(() => globalThis.location.replace(loginPathFor(back)), 1200);
}

client.interceptors.response.use(
  (res) => {
    const json = res.data as ApiEnvelope<unknown>;
    if (!json?.success) throw new Error(json?.message ?? `Request failed (${res.status})`);
    return res;
  },
  async (err: AxiosError<ApiEnvelope<unknown>>) => {
    const original = err.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    // Access token kedaluwarsa: minta yang baru sekali, lalu ulangi request.
    // Refresh token yang sudah dicabut (logout di perangkat lain, ganti kata
    // sandi) ditolak BE, dan sesi diakhiri di bawah.
    if (err.response?.status === 401 && original && !original._retried && !isAuthEndpoint(original.url)) {
      original._retried = true;
      try {
        refreshing ??= refreshAccessToken().finally(() => {
          refreshing = null;
        });
        original.headers.Authorization = `Bearer ${await refreshing}`;
        return client.request(original);
      } catch {
        endSession();
      }
    } else if (err.response?.status === 401 && !isAuthEndpoint(original?.url)) {
      endSession();
    }

    // Pesan dari BE lebih berguna daripada "Request failed with status code 409".
    if (err.response?.data?.message) err.message = err.response.data.message;
    return Promise.reject(err);
  },
);

async function request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await client.request<ApiEnvelope<T>>({
    url: path,
    method: options.method ?? 'GET',
    data: options.body,
  });
  return res.data.data as T;
}

/** Hanya dipakai src/api/index.ts — komponen & hook tidak memanggil http langsung. */
export const http = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T,>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  del: <T,>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/**
 * Satu halaman list, filter dikirim sebagai query param. Dipakai halaman
 * daftar lewat `useInfiniteQuery` (tombol "Tampilkan lagi").
 */
export async function fetchPage<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<{ data: T[]; meta: ApiMeta }> {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') cleaned[key] = String(value);
  }
  const res = await client.request<ApiEnvelope<T[]>>({ url: path, params: cleaned });
  return { data: res.data.data ?? [], meta: res.data.meta! };
}

/**
 * SEMUA baris sebuah list (loop per 100). Hanya untuk kebutuhan yang memang
 * butuh semua baris, mis. dropdown pemilih; jangan untuk halaman daftar
 * (pakai fetchPage) dan jangan untuk mencari satu item (pakai endpoint detail).
 */
export async function fetchAllPages<T>(path: string, params: Record<string, string> = {}): Promise<T[]> {
  const all: T[] = [];
  for (let page = 1; ; page += 1) {
    const { data, meta } = await fetchPage<T>(path, { ...params, page, per_page: 100 });
    all.push(...data);
    if (!meta || page >= meta.last_page) return all;
  }
}
