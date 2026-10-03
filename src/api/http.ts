import axios from 'axios';

/** Prefix API. Default origin yang sama (dev: proxy Vite, produksi: proxy nginx). */
export const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/** Amplop semua respons BE (ApiResponse di BE). */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string>;
}

export type QueryParams = Record<string, string | number | string[] | undefined>;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  // Array dikirim sebagai key berulang (`productLine=a&productLine=b`), bukan
  // `productLine[]=a`: begitu yang dibaca BE.
  paramsSerializer: { indexes: null },
});

client.interceptors.response.use(
  (res) => {
    const json = res.data as ApiEnvelope<unknown>;
    if (!json?.success) throw new Error(json?.message ?? `Request failed (${res.status})`);
    return res;
  },
  (err) => {
    // Pesan dari BE lebih berguna daripada "Request failed with status code 429".
    if (axios.isAxiosError<ApiEnvelope<unknown>>(err) && err.response?.data?.message) {
      err.message = err.response.data.message;
    }
    return Promise.reject(err);
  },
);

/** Buang parameter kosong supaya URL (dan key cache BE) tetap bersih. */
function clean(params: QueryParams): QueryParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)),
  );
}

/** Hanya dipakai src/api/index.ts — komponen & hook tidak memanggil http langsung. */
export const http = {
  get: async <T,>(path: string, params: QueryParams = {}): Promise<T> => {
    const res = await client.get<ApiEnvelope<T>>(path, { params: clean(params) });
    return res.data.data as T;
  },
};
