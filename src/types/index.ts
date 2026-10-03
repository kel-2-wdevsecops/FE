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

export type UserRole = 'admin' | 'staff';

/** Akun login API (tabel `users`, BE: formatUser). */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/** Body POST/PUT /users. Saat ubah, `password` kosong = tidak diganti. */
export interface UserInput {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

/** Kantor cabang Axon (tabel `offices`, BE: offices.service formatOffice). */
export interface Office {
  officeCode: string;
  city: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  state: string | null;
  country: string;
  postalCode: string;
  territory: string;
  /** Jumlah karyawan di kantor ini (dihitung BE). */
  employeeCount: number;
}

/** Body POST/PUT /offices. Opsional dikirim '' -> BE menyimpan NULL. */
export type OfficeInput = Omit<Office, 'employeeCount' | 'addressLine2' | 'state'> & {
  addressLine2: string;
  state: string;
};

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
}
