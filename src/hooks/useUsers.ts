import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/api';
import { queryKeys } from '@/api/queryKeys';
import { toastMutationError } from '@/lib/toastError';
import type { UserInput } from '@/types';

/** Halaman daftar: satu halaman per request, pencarian di server, "Tampilkan lagi". */
export function useUsersList(search: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.usersList(search),
    queryFn: ({ pageParam }) => api.listUsersPage({ page: pageParam, search }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
  });
}

/** Satu pengguna by id (GET /users/:id) — halaman detail & modal ubah. Bukan `.find()` dari daftar. */
export const useUser = (id?: string) =>
  useQuery({ queryKey: queryKeys.userById(id), queryFn: () => api.getUser(id!), enabled: Boolean(id) });

export function useUserMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.usersListAll });
    qc.invalidateQueries({ queryKey: queryKeys.userByIdAll });
    // Kalau yang diubah akun sendiri, nama di sidebar ikut diperbarui.
    qc.invalidateQueries({ queryKey: queryKeys.me });
  };

  return {
    create: useMutation({
      mutationFn: (input: UserInput) => api.createUser(input),
      onSuccess: () => {
        invalidate();
        toast.success('Pengguna ditambahkan');
      },
      onError: (err) => toastMutationError(err, 'Gagal menambahkan pengguna'),
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<UserInput> }) => api.updateUser(id, patch),
      onSuccess: () => {
        invalidate();
        toast.success('Pengguna diperbarui');
      },
      onError: (err) => toastMutationError(err, 'Gagal memperbarui pengguna'),
    }),
    remove: useMutation({
      mutationFn: (id: string) => api.deleteUser(id),
      onSuccess: () => {
        invalidate();
        toast.success('Pengguna dihapus');
      },
      onError: (err) => toastMutationError(err, 'Gagal menghapus pengguna'),
    }),
  };
}
