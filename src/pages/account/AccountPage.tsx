import { PageHeader } from '@/components/layout/PageHeader';
import { MetaList } from '@/components/ui/MetaList';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { formatDateTime } from '@/lib/format';
import { ROLE_LABEL } from '@/lib/labels';
import { ChangePasswordForm } from './components/ChangePasswordForm';

/** Akun sendiri: profil (baca) dan ganti kata sandi. Nama/peran diubah admin di Pengguna. */
export function AccountPage() {
  const user = useCurrentUser();
  if (!user) return null;

  return (
    <>
      <PageHeader title="Akun" subtitle="Profil dan keamanan akun Anda" />

      <section className="rounded-xl border border-line bg-white px-[18px] pt-4 pb-5">
        <MetaList
          rows={[
            { key: 'Nama', value: user.name },
            { key: 'Email', value: user.email },
            { key: 'Peran', value: ROLE_LABEL[user.role] },
            { key: 'Dibuat', value: formatDateTime(user.createdAt) },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-line bg-white px-[18px] pt-4 pb-5">
        <div>
          <h2 className="m-0 text-[14px] font-semibold tracking-[-0.01em]">Ganti kata sandi</h2>
          <p className="mt-1 mb-0 text-[12.5px] text-ink-muted">
            Semua sesi di perangkat lain akan dikeluarkan setelah kata sandi diganti.
          </p>
        </div>
        <ChangePasswordForm />
      </section>
    </>
  );
}
