// Semua queryKey react-query berasal dari sini; jangan menulis array literal
// di hook/komponen. Key statis = `as const` array, key berparameter = fungsi,
// mis. `overview: (filter: OverviewFilter) => ['dashboard-overview', filter] as const`.
export const queryKeys = {
  health: ['health'] as const,
};
