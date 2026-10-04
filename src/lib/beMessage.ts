// BE menjawab dengan pesan berbahasa Inggris. Pesan yang sudah dikenal
// diterjemahkan di sini; pesan yang belum dikenal ditampilkan apa adanya.

const EXACT: Record<string, string> = {
  'Too many requests. Please try again later.': 'Terlalu banyak permintaan. Coba lagi sebentar lagi.',
  'Internal server error. Please try again.': 'Terjadi kesalahan di server. Coba lagi.',
  'Validation failed': 'Filter tidak valid.',
  'Endpoint not found.': 'Data tidak ditemukan.',
};

export function translateBeMessage(message: string): string {
  return EXACT[message] ?? message;
}
