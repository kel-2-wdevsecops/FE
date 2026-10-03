import { Modal } from '@/components/ui/Modal';
import { useUser } from '@/hooks/useUsers';
import { useUiStore } from '@/store/useUiStore';
import { UserForm } from './UserForm';

/** Modal buat/ubah pengguna — dipasang global di `GlobalOverlays`, dibuka lewat `setUserFormTarget`. */
export function UserFormModal() {
  const target = useUiStore((s) => s.userFormTarget);
  const setTarget = useUiStore((s) => s.setUserFormTarget);

  const editing = Boolean(target?.id);
  const { data: user } = useUser(editing ? target!.id : undefined);

  if (!target) return null;
  if (editing && !user) return null;

  const close = () => setTarget(null);

  return (
    <Modal title={editing ? 'Ubah pengguna' : 'Pengguna baru'} onClose={close}>
      <UserForm user={user} onDone={close} onCancel={close} />
    </Modal>
  );
}
