# F07 — Sorotan Insight dan Rekomendasi (FE)

| | |
|---|---|
| Prioritas | P1 |
| Repo / branch | FE · `feat/f07-sorotan-insight` |
| Pasangan BE | `feat/f07-sorotan-insight` di repo BE (endpoint `GET /api/v1/dashboard/insights`) |
| Tampil di | Panel "Sorotan" pada `/` (halaman F01) |
| Padanan | Slide Suggestions, Insight's, dan Recommendation di PPTX |
| Bergantung pada | FE F01 ter-merge (slot panel); BE F07 ter-merge (atau BE lokal berjalan dengan endpoint-nya) |
| Status | ⬜ Belum mulai |

## Tujuan

Mengubah angka menjadi kalimat yang bisa langsung ditindaklanjuti. Ini menjawab langsung tujuan proyek: dashboard tidak hanya menampilkan data, tetapi menunjukkan apa yang perlu diputuskan.

## User Stories

- Sebagai eksekutif dengan waktu terbatas, saya ingin membaca 5–9 poin penting tanpa harus menafsirkan grafik.
- Sebagai manajer, saya ingin setiap poin disertai rekomendasi dan tautan ke halaman detailnya.

## Pembagian Tugas dengan BE

Aturan insight (9 aturan, ambang, dan template teks) seluruhnya dihitung di BE; teks dikirim jadi dalam bahasa Indonesia dengan format angka `id-ID`. FE hanya merender. Daftar aturan ada di dokumen F07 repo BE. FE tidak membuat, menghitung, atau menerjemahkan insight.

## Kontrak API (salinan dari dokumen BE; BE adalah sumber kebenaran)

`GET /api/v1/dashboard/insights` (tanpa filter; dihitung atas seluruh data)

```json
[
  {
    "id": "top-product-line",
    "severity": "info",
    "title": "Classic Cars adalah lini terbesar",
    "detail": "Classic Cars menyumbang 40,13 % penjualan (3.853.922,49 dari 9.604.190,61).",
    "recommendation": "Perluas lini Classic Cars dan Vintage Cars; evaluasi lini dengan penjualan rendah.",
    "metric": { "value": 40.13, "unit": "percent" },
    "link": "/produk"
  }
]
```

- `severity`: `positive` (tren baik), `info` (fakta struktural), `warning` (perlu tindakan). Urutan respons: `warning`, lalu `positive`, lalu `info`. FE mempertahankan urutan dari BE.
- `link` hanya route internal yang dikenal, tidak pernah URL eksternal; FE memakainya sebagai tautan route internal (bukan `<a href>` eksternal).

## Tampilan

- Panel kartu di Ringkasan, maksimal 6 kartu terlihat dan tombol "Lihat semua".
- Ikon dan teks label untuk severity (tidak hanya warna).
- Setiap kartu bisa diklik menuju halaman pada `link`.
- Array kosong → "Belum ada insight" (`EmptyState`), bukan error.

## Langkah Pengerjaan

- [ ] 1. Buat branch `feat/f07-sorotan-insight` dari `main` terbaru (FE F01 sudah ter-merge); ubah status F07 di `docs/PRD.md` §7 menjadi 🟨.
- [ ] 2. Tipe `Insight` (`id`, `severity`, `title`, `detail`, `recommendation`, `metric`, `link`) di `src/types/index.ts`; `api.insights()` di `src/api/index.ts`; key di `src/api/queryKeys.ts`.
- [ ] 3. Hook `useInsights` di `src/hooks/` (`staleTime: Infinity`); tanpa filter, sehingga tidak ikut berubah saat filter halaman berganti.
- [ ] 4. Komponen panel Sorotan (mis. `src/pages/home/components/`) yang mengisi slot di halaman F01, dibungkus `QueryState`.
- [ ] 5. Kartu insight: ikon + teks label severity (Perlu tindakan / Positif / Info), judul, detail, rekomendasi; seluruh kartu dapat diklik ke route internal `link` (dapat difokus dan dioperasikan dengan keyboard).
- [ ] 6. Maksimal 6 kartu terlihat dan tombol "Lihat semua" untuk menampilkan sisanya (fungsi murni pembatas + test di `src/lib/` bila ada logika).
- [ ] 7. Keadaan kosong "Belum ada insight"; keadaan error ditangani `QueryState` tanpa merusak halaman Ringkasan.
- [ ] 8. Responsif; cek CSP.
- [ ] 9. Uji manual terhadap BE lokal berisi dump dan terhadap DB kosong.
- [ ] 10. `npm run lint`, `npm test`, `npm run build` hijau.
- [ ] 11. Commit terakhir: status F07 di PRD §7 menjadi 🟩, isi kolom PR; buka PR ke `main`.

## Kriteria Penerimaan

- [ ] Dengan data dump, panel menampilkan 6 kartu terlebih dulu dan "Lihat semua" menampilkan seluruh 9 insight, dengan teks dan angka persis seperti dari API.
- [ ] Pada DB kosong (array kosong), panel menampilkan "Belum ada insight" tanpa error.
- [ ] Setiap kartu memiliki ikon dan teks label severity, tidak hanya warna.
- [ ] Klik kartu (atau Enter saat fokus) membuka halaman pada `link` di aplikasi yang sama.
- [ ] Kegagalan endpoint insights tidak menghilangkan KPI dan grafik Ringkasan.

## Definisi Selesai

Langkah dan kriteria tercentang, CI hijau, status di PRD §7 = 🟩.
