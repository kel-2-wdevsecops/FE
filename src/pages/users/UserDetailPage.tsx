import { useNavigate, useParams } from 'react-router-dom';
import { QueryState } from '@/components/feedback/QueryState';
import { DetailPageLayout } from '@/components/layout/DetailPageLayout';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { MetaList } from '@/components/ui/MetaList';
import { MoreActionsButton } from '@/components/ui/MoreActionsButton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUser, useUserMutations } from '@/hooks/useUsers';
import { formatDateTime } from '@/lib/format';
import { ROLE_LABEL } from '@/lib/labels';
import { confirmAction } from '@/store/useConfirmStore';
import { useUiStore } from '@/store/useUiStore';

/** Detail pengguna — murni tampilan; ubah lewat `UserFormModal`. */
export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const me = useCurrentUser();

  const query = useUser(id);
  const { remove } = useUserMutations();
  const user = query.data;

  return (
    <QueryState isLoading={query.isLoading} isError={query.isError}>
      {user && (
        <DetailPageLayout
          title={user.name}
          backTo="/pengguna"
          badge={<Badge className="border-line bg-line-soft text-ink-soft">{ROLE_LABEL[user.role]}</Badge>}
          actions={
            <DropdownMenu
              trigger={<MoreActionsButton />}
              items={[
                { label: 'Ubah', onClick: () => useUiStore.getState().setUserFormTarget({ id: user.id }) },
                {
                  label: 'Hapus pengguna',
                  danger: true,
                  // BE juga menolak (409); di sini supaya tidak perlu mencoba.
                  disabled: user.id === me?.id,
                  onClick: async () => {
                    const ok = await confirmAction(`Hapus akun "${user.name}"? Akun ini tidak bisa masuk lagi.`, {
                      title: 'Hapus pengguna',
                    });
                    if (!ok) return;
                    remove.mutate(user.id, { onSuccess: () => navigate('/pengguna') });
                  },
                },
              ]}
            />
          }
        >
          <MetaList
            rows={[
              { key: 'Email', value: user.email },
              { key: 'Peran', value: ROLE_LABEL[user.role] },
              { key: 'Dibuat', value: formatDateTime(user.createdAt) },
              { key: 'Diperbarui', value: formatDateTime(user.updatedAt) },
            ]}
          />
        </DetailPageLayout>
      )}
    </QueryState>
  );
}
