// Semua queryKey react-query berasal dari sini; jangan menulis array literal
// di hook/komponen. Key statis = `as const` array, key berparameter = fungsi.
// Prefix `...All` dipakai mutation untuk meng-invalidate semua variannya.
export const queryKeys = {
  health: ['health'] as const,
};
