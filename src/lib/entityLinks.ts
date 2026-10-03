/**
 * Satu sumber path halaman detail tiap entity; jangan hardcode `/pengguna/${id}`
 * di tempat lain. Hanya path MELIHAT detail; buat/ubah lewat modal
 * (`useUiStore` `*FormTarget`).
 */
export const userPath = (id: string) => `/pengguna/${id}`;
