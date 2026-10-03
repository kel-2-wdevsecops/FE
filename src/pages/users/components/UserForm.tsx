import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { SelectInput, TextInput } from '@/components/ui/inputs';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUserMutations } from '@/hooks/useUsers';
import { errorInputClass, getFieldErrors } from '@/lib/formErrors';
import { ROLE_LABEL } from '@/lib/labels';
import type { User, UserInput, UserRole } from '@/types';

// Sama dengan PasswordSchema di BE (auth.dto.ts).
const MIN_PASSWORD = 8;

const ROLE_OPTIONS = (['staff', 'admin'] as const).map((role) => ({ value: role, label: ROLE_LABEL[role] }));

interface UserFormProps {
  user?: User;
  onDone: () => void;
  onCancel: () => void;
}

export function UserForm({ user, onDone, onCancel }: UserFormProps) {
  const { create, update } = useUserMutations();
  const me = useCurrentUser();
  // Mengubah peran atau kata sandi akun sendiri dari sini mencabut sesi
  // sendiri (BE menaikkan tokenVersion); ganti kata sandi sendiri di /akun.
  const isSelf = Boolean(user && user.id === me?.id);

  const [draft, setDraft] = useState<UserInput>({
    email: user?.email ?? '',
    name: user?.name ?? '',
    role: user?.role ?? 'staff',
    password: '',
  });
  const set = <K extends keyof UserInput>(key: K, value: UserInput[K]) => setDraft((d) => ({ ...d, [key]: value }));

  // Nama field FE = nama field BE di sini, jadi error 422 tidak perlu di-remap.
  const fieldErrors = getFieldErrors(user ? update.error : create.error);
  const busy = create.isPending || update.isPending;
  const passwordTooShort = draft.password.length > 0 && draft.password.length < MIN_PASSWORD;
  const incomplete =
    !draft.name.trim() || !draft.email.trim() || passwordTooShort || (!user && !draft.password);

  const submit = async () => {
    if (user) {
      // Kata sandi kosong = tidak diganti.
      const { password, ...rest } = draft;
      await update.mutateAsync({ id: user.id, patch: password ? draft : rest });
    } else {
      await create.mutateAsync(draft);
    }
    onDone();
  };

  return (
    <div className="flex flex-col gap-3">
      <Field label="Nama" error={fieldErrors.name}>
        <TextInput
          value={draft.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Diane Murphy"
          className={fieldErrors.name ? errorInputClass : undefined}
        />
      </Field>
      <Field label="Email" error={fieldErrors.email}>
        <TextInput
          type="email"
          value={draft.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="nama@perusahaan.co.id"
          className={fieldErrors.email ? errorInputClass : undefined}
        />
      </Field>
      <Field
        label="Peran"
        hint={isSelf ? 'Peran akun sendiri tidak bisa diubah.' : 'Admin dapat mengelola pengguna dan data.'}
        error={fieldErrors.role}
      >
        <SelectInput
          value={draft.role}
          onChange={(e) => set('role', e.target.value as UserRole)}
          options={ROLE_OPTIONS}
          disabled={isSelf}
        />
      </Field>
      {!isSelf && (
        <Field
          label={user ? 'Kata sandi baru' : 'Kata sandi'}
          hint={
            user
              ? 'Kosongkan kalau tidak diganti. Mengganti kata sandi mengeluarkan semua sesi akun ini.'
              : `Minimal ${MIN_PASSWORD} karakter.`
          }
          error={fieldErrors.password ?? (passwordTooShort ? `Minimal ${MIN_PASSWORD} karakter.` : undefined)}
        >
          <TextInput
            type="password"
            autoComplete="new-password"
            value={draft.password}
            onChange={(e) => set('password', e.target.value)}
            className={fieldErrors.password || passwordTooShort ? errorInputClass : undefined}
          />
        </Field>
      )}
      <div className="mt-0.5 flex gap-2">
        <Button variant="primary" size="md" disabled={busy || incomplete} onClick={() => void submit().catch(() => {})}>
          {user ? 'Simpan perubahan' : 'Simpan pengguna'}
        </Button>
        <Button size="md" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </div>
  );
}
