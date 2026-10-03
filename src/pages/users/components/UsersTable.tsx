import { CellLink } from '@/components/table/CellLink';
import { CellText } from '@/components/table/CellText';
import { DataTable, type Column } from '@/components/table/DataTable';
import { TableFooterNote } from '@/components/table/TableFooterNote';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { userPath } from '@/lib/entityLinks';
import { formatDateTime } from '@/lib/format';
import { ROLE_LABEL } from '@/lib/labels';
import type { User } from '@/types';

const GRID = 'minmax(0,1.4fr) minmax(0,1.8fr) minmax(0,0.7fr) minmax(0,1fr)';

interface UsersTableProps {
  users: User[];
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function UsersTable({ users, total, hasMore, isLoadingMore, onLoadMore }: UsersTableProps) {
  const columns: Column<User>[] = [
    { id: 'name', label: 'Nama', render: (user) => <CellLink label={user.name} to={userPath(user.id)} /> },
    { id: 'email', label: 'Email', render: (user) => <CellText value={user.email} muted /> },
    {
      id: 'role',
      label: 'Peran',
      render: (user) => (
        <Badge
          className={
            user.role === 'admin' ? 'border-accent bg-accent text-white' : 'border-line bg-line-soft text-ink-soft'
          }
        >
          {ROLE_LABEL[user.role]}
        </Badge>
      ),
    },
    {
      id: 'created',
      label: 'Dibuat',
      align: 'right',
      render: (user) => <CellText align="right" value={formatDateTime(user.createdAt)} muted />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      rowKey={(user) => user.id}
      gridTemplate={GRID}
      empty="Belum ada pengguna yang cocok."
      footer={
        <TableFooterNote
          action={
            hasMore ? (
              <Button onClick={onLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? 'Memuat…' : 'Tampilkan lagi'}
              </Button>
            ) : undefined
          }
        >
          Menampilkan {users.length} dari {total} pengguna
        </TableFooterNote>
      }
    />
  );
}
