import axios, { type AxiosError } from 'axios';

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

client.interceptors.response.use(
  (res) => {
    const json = res.data as ApiEnvelope<unknown>;
    if (!json?.success) throw new Error(json?.message ?? `Request failed (${res.status})`);
    return res;
  },
  (err: AxiosError<ApiEnvelope<unknown>>) => {
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
