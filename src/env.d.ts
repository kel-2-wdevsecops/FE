/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Opsional: URL API absolut. Kosong = /api/v1 di origin yang sama (lihat .env.example). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
