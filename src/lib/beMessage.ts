// BE menjawab dengan pesan berbahasa Inggris (mis. "Invalid email or
// password."). Pesan yang sudah dikenal diterjemahkan di sini, satu tempat
// untuk semua toast dan alert; pesan yang belum dikenal ditampilkan apa
// adanya. Endpoint baru di BE -> tambahkan pesannya di bagian fiturnya.

const EXACT: Record<string, string> = {
  // Umum (error middleware & rate limiter BE)
  'Too many requests. Please try again later.': 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.',
  'Internal server error. Please try again.': 'Terjadi kesalahan di server. Coba lagi.',
  'Validation failed': 'Ada isian yang belum benar.',
  'Data not found.': 'Data tidak ditemukan.',
  'You do not have permission to perform this action.': 'Akun Anda tidak punya izin untuk tindakan ini.',

  // Auth
  'Invalid email or password.': 'Email atau kata sandi salah.',
  'Current password does not match.': 'Kata sandi saat ini salah.',
  'Session is no longer valid. Please log in again.': 'Sesi berakhir. Silakan masuk kembali.',
  'Token has expired. Please log in again.': 'Sesi berakhir. Silakan masuk kembali.',

  // Users
  'Email is already registered.': 'Email sudah dipakai akun lain.',
  'Cannot remove the last admin.': 'Admin terakhir tidak bisa dihapus atau diturunkan perannya.',
  'You cannot delete your own account.': 'Anda tidak bisa menghapus akun sendiri.',
  'User not found.': 'Pengguna tidak ditemukan.',

  // Offices
  'Office code is already used.': 'Kode kantor sudah dipakai kantor lain.',
  'Office not found.': 'Kantor tidak ditemukan.',

  // Foreign key classicmodels (ON DELETE RESTRICT), lihat error middleware BE.
  'Operation violates a relation: the referenced data does not exist or is still in use.':
    'Data ini masih dipakai data lain, atau data yang dirujuk tidak ada.',
};

const PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [
    /^Office still has (\d+) employee\(s\)\.$/,
    (m) => `Kantor masih punya ${m[1]} karyawan. Pindahkan karyawannya ke kantor lain dulu.`,
  ],
];

export function translateBeMessage(message: string): string {
  if (EXACT[message]) return EXACT[message];
  for (const [pattern, toText] of PATTERNS) {
    const match = message.match(pattern);
    if (match) return toText(match);
  }
  return message;
}
