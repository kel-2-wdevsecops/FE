# F00 — Fondasi API: Validasi, Cache, dan Keamanan (FE)

| | |
|---|---|
| Prioritas | P0 |
| Repo / branch | FE · **tidak ada branch dan tidak ada pekerjaan FE** |
| Pasangan BE | `feat/f00-fondasi-api` di repo BE (seluruh scope F00 ada di sana) |
| Status | – (tidak berlaku untuk FE) |

## Mengapa dokumen ini ada

Dokumen fitur F00 asli bertanda `Repo: BE`: isinya validasi Zod, cache TTL, aturan query, bentuk respons, dan tes angka emas, semuanya kode server. Dokumen ini hanya menjaga penomoran F00–F07 tetap sama di kedua repo supaya nama branch dan papan status mudah dipetakan. Tidak ada yang perlu dikerjakan di repo FE untuk F00.

## Yang perlu diketahui FE dari F00 (tanpa pekerjaan tambahan)

Fondasi ini memberi FE jaminan berikut; FE cukup menghormatinya saat mengerjakan F01–F07:

- **Parameter query ketat.** BE menolak parameter tak dikenal dan nilai di luar daftar dengan 422. Karena itu FE hanya mengirim parameter yang berlaku di halaman itu, dengan nilai yang berasal dari endpoint `/dashboard/filters` (F06). Pembersihan URL rusak sebelum request dilakukan oleh `src/lib/filters.ts` (F06 FE), sehingga pengguna tidak melihat error karena tautan rusak.
- **Array dikirim sebagai key berulang** (`productLine=a&productLine=b`). Urutan dinormalisasi (diurutkan) di FE agar key react-query dan key cache BE sama. Dua URL dengan filter sama harus menghasilkan request yang sama.
- **Respons di-cache 5 menit** (`Cache-Control: public, max-age=300`) dan datanya statis, sehingga `staleTime: Infinity` dan `placeholderData: keepPreviousData` di hook FE sudah sesuai.
- **Field pribadi tidak pernah dikirim** (`phone`, `addressLine*`, `postalCode`, `email`, `extension`, `contactFirstName`, `contactLastName`, `checkNumber`, `creditLimit` per customer). FE tidak boleh mengharapkan atau menampilkannya.
- **Database kosong tetap 200** dengan nilai nol/array kosong. FE menampilkan keadaan ini sebagai `EmptyState`, bukan error.
- **Pesan error BE** sudah diterjemahkan oleh `src/lib/beMessage.ts` yang ada; tidak ada perubahan.

## Langkah Pengerjaan

Tidak ada. Status F00 FE tidak dilacak di papan PRD FE.

Untuk melihat kemajuan F00, lihat papan status di `docs/PRD.md` repo BE. FE F06 dan F01 baru bisa diintegrasikan setelah F00 dan endpoint terkait di BE ter-merge.
