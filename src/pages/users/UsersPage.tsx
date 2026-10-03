import { QueryState } from '@/components/feedback/QueryState';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchAddBar } from '@/components/layout/SearchAddBar';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useUsersList } from '@/hooks/useUsers';
import { useUiStore } from '@/store/useUiStore';
import { UsersTable } from './components/UsersTable';

/** Daftar akun login API (admin). */
export function UsersPage() {
  const query = useUiStore((s) => s.search.users);
  const setSearch = useUiStore((s) => s.setSearch);
  const setUserFormTarget = useUiStore((s) => s.setUserFormTarget);

  const list = useUsersList(useDebouncedValue(query));
  const rows = list.data?.pages.flatMap((p) => p.data) ?? [];
  const total = list.data?.pages[0]?.meta.total ?? 0;

  return (
    <>
      <PageHeader title="Pengguna" subtitle={`${total} akun yang bisa masuk ke aplikasi`}>
        <SearchAddBar
          searchValue={query}
          onSearchChange={(value) => setSearch('users', value)}
          searchPlaceholder="Cari nama atau email"
          addLabel="Tambah pengguna"
          onAdd={() => setUserFormTarget({})}
        />
      </PageHeader>

      <QueryState isLoading={list.isLoading} isError={list.isError}>
        <UsersTable
          users={rows}
          total={total}
          hasMore={Boolean(list.hasNextPage)}
          isLoadingMore={list.isFetchingNextPage}
          onLoadMore={() => void list.fetchNextPage()}
        />
      </QueryState>
    </>
  );
}
