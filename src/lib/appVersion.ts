// Versi FE yang sedang berjalan = "version" di package.json saat build,
// disisipkan Vite lewat `define` (vite.config.ts). Angka itu dinaikkan
// release-please di setiap rilis, jadi jangan diubah manual.
declare const __APP_VERSION__: string;

export const APP_VERSION: string = __APP_VERSION__;
