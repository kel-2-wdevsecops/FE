// BE menjawab dengan pesan berbahasa Inggris (mis. "Office code is already
// used."). Pesan yang sudah dikenal diterjemahkan di sini, satu tempat untuk
// semua toast; pesan yang belum dikenal ditampilkan apa adanya.

const EXACT: Record<string, string> = {
  'Too many requests. Please try again later.': 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.',
  'Internal server error. Please try again.': 'Terjadi kesalahan di server. Coba lagi.',
  'Validation failed': 'Ada isian yang belum benar.',
  'Data not found.': 'Data tidak ditemukan.',
};

const PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [];

/** Daftarkan terjemahan tambahan (dipanggil modul fitur saat di-import). */
export function registerBeMessages(exact: Record<string, string>, patterns: typeof PATTERNS = []) {
  Object.assign(EXACT, exact);
  PATTERNS.push(...patterns);
}

export function translateBeMessage(message: string): string {
  if (EXACT[message]) return EXACT[message];
  for (const [pattern, toText] of PATTERNS) {
    const match = message.match(pattern);
    if (match) return toText(match);
  }
  return message;
}
