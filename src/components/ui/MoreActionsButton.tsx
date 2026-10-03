/**
 * Trigger titik-tiga untuk `DropdownMenu` — dibuat terpisah dari `IconButton`
 * (dipakai juga untuk tombol tutup panel) supaya tampilannya bisa dibuat
 * menonjol di semua tempat sekaligus tanpa mengubah tombol tutup.
 */
export function MoreActionsButton() {
  return (
    <button
      type="button"
      aria-label="Aksi lainnya"
      title="Aksi lainnya"
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[17px] leading-none font-bold text-zinc-700 shadow-xs transition-colors hover:border-zinc-400 hover:bg-zinc-200 hover:text-zinc-900"
    >
      ⋯
    </button>
  );
}
