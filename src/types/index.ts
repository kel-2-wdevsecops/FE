// Bentuk data yang dipakai komponen. Satu-satunya sumber kebenaran tipe FE.
// Nama field mengikuti respons BE (camelCase, sama dengan kolom classicmodels).
// Kalau suatu saat bentuk BE berbeda, terjemahkan di src/api/index.ts, jangan
// di komponen.

/** GET /api/v1/health */
export interface Health {
  status: 'ok';
  version: string;
  uptime: number;
}
