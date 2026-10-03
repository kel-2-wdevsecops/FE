import { QueryState } from '@/components/feedback/QueryState';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchAddBar } from '@/components/layout/SearchAddBar';
import { useIsAdmin } from '@/hooks/useCurrentUser';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useOfficesList } from '@/hooks/useOffices';
import { useUiStore } from '@/store/useUiStore';
import { OfficesTable } from './components/OfficesTable';

/** Daftar kantor. Contoh acuan halaman daftar untuk modul lain. */
export function OfficesPage() {
  const query = useUiStore((s) => s.search.offices);
  const setSearch = useUiStore((s) => s.setSearch);
  const setOfficeFormTarget = useUiStore((s) => s.setOfficeFormTarget);
  const isAdmin = useIsAdmin();

  // Debounce: satu request setelah pengguna berhenti mengetik, bukan per huruf.
  const list = useOfficesList(useDebouncedValue(query));
  const rows = list.data?.pages.flatMap((p) => p.data) ?? [];
  const total = list.data?.pages[0]?.meta.total ?? 0;

  return (
    <>
      <PageHeader title="Kantor" subtitle={`${total} kantor cabang`}>
        <SearchAddBar
          searchValue={query}
          onSearchChange={(value) => setSearch('offices', value)}
          searchPlaceholder="Cari kode atau kota"
          addLabel="Tambah kantor"
          // Staf hanya membaca; BE juga menolak (403) tulis dari staf.
          onAdd={isAdmin ? () => setOfficeFormTarget({}) : undefined}
        />
      </PageHeader>

      <QueryState isLoading={list.isLoading} isError={list.isError}>
        <OfficesTable
          offices={rows}
          total={total}
          hasMore={Boolean(list.hasNextPage)}
          isLoadingMore={list.isFetchingNextPage}
          onLoadMore={() => void list.fetchNextPage()}
        />
      </QueryState>
    </>
  );
}
