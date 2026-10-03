import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { SearchInput } from './SearchInput';

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

interface SearchAddBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  /** Tanpa `onAdd`, tombol tambah tidak ditampilkan (mis. akun staff yang hanya boleh membaca). */
  addLabel?: string;
  onAdd?: () => void;
  /** Tombol filter ringkas (mis. `FilterButton`) di antara kolom cari dan tombol tambah. */
  filter?: ReactNode;
}

/**
 * Kolom cari + tombol tambah utama di kepala halaman daftar — dipakai sama
 * persis di semua halaman daftar. Di mobile,
 * tombolnya jadi ikon plus saja supaya sebaris dengan kolom cari, bukan
 * menumpuk ke baris sendiri.
 */
export function SearchAddBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  addLabel,
  onAdd,
  filter,
}: SearchAddBarProps) {
  return (
    <div className="flex w-full items-center gap-2 md:w-auto md:gap-3.5">
      <SearchInput value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
      {filter}
      {onAdd && addLabel && (
        <>
          {/* Dibungkus `<span>` terpisah, bukan `hidden`/`md:inline-flex` langsung di
              className Button: Button sudah punya `inline-flex` bawaan, dan dua
              utility display tanpa prefix di elemen yang sama rawan tabrakan urutan
              di stylesheet Tailwind. */}
          <span className="hidden shrink-0 md:inline-flex">
            <Button variant="primary" size="md" onClick={onAdd}>
              {addLabel}
            </Button>
          </span>
          <button
            type="button"
            onClick={onAdd}
            aria-label={addLabel}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[9px] bg-accent text-white transition-colors hover:bg-accent-hover md:hidden"
          >
            <PlusIcon />
          </button>
        </>
      )}
    </div>
  );
}
