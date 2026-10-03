# Axon Sales (FE)

Antarmuka web untuk [Axon Sales API](https://github.com/kel-2-wdevsecops/BE), yaitu data penjualan Axon dari database `classicmodels`. Repo ini baru berisi **boilerplate**: kerangka aplikasi, login, kelola pengguna (admin), satu modul contoh (`offices`, menu "Kantor"), dan pipeline CI/CD. Modul data lainnya dibangun dengan pola yang sama.

Stack: React 19, TypeScript, Vite 8, Tailwind v4, React Router 7, TanStack Query 5, Zustand, axios, Vitest. Strukturnya mengikuti Skopia FE.

## Menjalankan di lokal

1. Jalankan BE di `http://localhost:3008` (lihat README repo BE) dan buat admin pertama dengan `npm run db:seed` di BE.
2. Install dependency, lalu jalankan:
   ```bash
   npm install
   npm run dev
   ```
3. Buka `http://localhost:5173` dan masuk dengan akun admin tadi.

FE selalu memanggil `/api/v1` di origin yang sama. Saat `npm run dev`, Vite meneruskannya ke BE lokal. Kalau BE tidak di `localhost:3008`, salin `.env.example` ke `.env.local` lalu isi `VITE_DEV_API_TARGET`.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server dev dengan HMR |
| `npm run build` | Typecheck (`tsc -b`) + build ke `dist/` |
| `npm run typecheck` | Typecheck saja |
| `npm test` | Unit test Vitest (`src/**/*.test.ts`, fungsi murni) |
| `npm run lint` | ESLint, warning pun gagal (sama dengan CI) |
| `npm run preview` | Sajikan hasil build |

## Struktur

```
src/
  main.tsx        entry: QueryClient, Router, Toast, ConfirmModal
  app/            App.tsx (routing + RequireAuth/RequireAdmin), navigation.ts,
                  GlobalOverlays.tsx (semua modal form), queryClient.ts
  api/            SATU-SATUNYA lapisan yang bicara ke BE: http.ts (axios,
                  token, refresh), index.ts (endpoint), queryKeys.ts
  hooks/          satu file per entity (react-query di atas api/)
  components/     komponen yang tidak tahu entity apa pun: ui/, layout/,
                  table/, feedback/
  pages/<fitur>/  halaman + components/ milik satu fitur
  store/          zustand: useAuthStore (sesi), useUiStore (pencarian, modal),
                  useConfirmStore (konfirmasi)
  lib/            fungsi murni (format, label, terjemahan pesan BE, dll.)
  types/          tipe data FE
```

## Menambah modul (ikuti `offices`)

1. **Tipe**: tambahkan `X` dan `XInput` di `src/types/index.ts`. Nama field ikut respons BE; kalau berbeda, terjemahkan di `api/index.ts`.
2. **API**: endpoint di `src/api/index.ts` (`listXPage`, `getX`, `createX`, `updateX`, `deleteX`), dan key di `src/api/queryKeys.ts` (`xList`, `xById`, plus prefix `...All` untuk invalidasi).
3. **Hook**: `src/hooks/useX.ts`, salin `useOffices.ts`. Halaman detail dan modal ubah **wajib** mengambil satu item lewat endpoint detail, bukan `.find()` dari daftar.
4. **Halaman**: `pages/x/XPage.tsx` (daftar), `XDetailPage.tsx` (detail, hanya baca), `components/XTable.tsx`, `XForm.tsx`, `XFormModal.tsx`.
5. **Sambungkan**:
   - Route di `App.tsx`.
   - Menu di `navigation.ts`, dan path daftar di `WIDE_PATHS` (`AppShell.tsx`).
   - `xFormTarget` di `useUiStore` (juga di `resetOverlays`).
   - `<XFormModal />` di `GlobalOverlays.tsx`.
   - Path detail di `lib/entityLinks.ts`.
6. **Pesan BE**: pesan error baru dari BE (Inggris) diterjemahkan di `lib/beMessage.ts`.

Aturan yang perlu diingat:
- Buat/ubah selalu lewat modal (`setXFormTarget({})` / `({ id })`), bukan route. Hapus selalu lewat `confirmAction()`.
- Error validasi 422 diambil dengan `getFieldErrors()`; key-nya nama field BE.
- Tombol khusus admin disembunyikan dengan `useIsAdmin()`. Ini hanya tampilan; otorisasi sebenarnya di BE.
- Warna lewat token di `src/index.css` (`bg-accent`, `text-ink-muted`, ...), bukan `gray-*`.

## Auth

- Login menyimpan access dan refresh token di `useAuthStore` (localStorage).
- `api/http.ts` menempelkan token ke setiap request. Saat 401, http.ts meminta access token baru **sekali** lewat `/auth/refresh` lalu mengulang request. Kalau refresh ditolak (token dicabut atau kedaluwarsa), sesi berakhir dan pengguna diarahkan ke `/masuk?next=...`.
- Keluar memanggil `/auth/logout` supaya BE mencabut semua token akun itu.

## Produksi & keamanan

Image produksi berisi nginx-unprivileged (non-root, port 8080) dan hasil build statis:
- **Header keamanan** (`nginx/default.conf.template`): CSP ketat (script hanya dari origin sendiri), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- **Fallback SPA**: semua route dijawab `index.html` (tidak di-cache). Aset ber-hash di-cache selamanya.
- **Proxy `/api/`** ke BE (`API_UPSTREAM`, default `http://host.docker.internal:3008`).
- `/version.json` dipakai health check deploy.

## CI/CD

Sama dengan repo BE:
- **PR ke `main`** (`ci.yml`): commitlint, lint, `npm audit`, test, typecheck & build, Semgrep (OWASP + React), Gitleaks, Trivy fs, SBOM.
- **Push ke `main`** (`release.yml`): CI dijalankan dulu, lalu release-please membuka atau memperbarui **PR rilis**.
- **PR rilis di-merge**: `deploy.yml` berjalan: build, scan image, DAST (ZAP ke nginx), push GHCR, Cosign, provenance, verifikasi di server, deploy by digest, health check `/version.json`, dan rollback otomatis.

Deploy **hanya** terjadi saat PR rilis di-merge. Pesan commit wajib Conventional Commits: dicek hook husky dan CI, dan dipakai release-please untuk menentukan versi.

### Persiapan server (sekali, sebelum merge PR rilis pertama)

Server: self-hosted runner Windows. Folder FE terpisah dari BE: `D:\.server\kuliah\d4\devsecops\uts\fe`. Workflow membuatnya sendiri dan menyalin `compose.yaml` ke sana.

1. Pastikan BE sudah jalan di port 3008 host yang sama. FE di-publish di port **3009**.
2. Di BE, set `TRUST_PROXY=1`. Semua request API datang lewat nginx FE, jadi tanpa ini rate limiter BE menganggap semua pengguna ber-IP sama.
3. Secret `NTFY_TOPIC` (opsional) dan pengaturan Actions sama dengan repo BE. "Allow GitHub Actions to create and approve pull requests" harus menyala untuk release-please.
