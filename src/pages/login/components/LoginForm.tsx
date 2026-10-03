import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { TextInput } from '@/components/ui/inputs';
import { useLogin } from '@/hooks/useAuth';
import { translateBeMessage } from '@/lib/beMessage';
import { cn } from '@/lib/cn';
import { errorInputClass, getFieldErrors } from '@/lib/formErrors';
import { safeNextPath } from '@/lib/loginRedirect';

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  /** Naik setiap gagal: dipakai sebagai `key` untuk memutar ulang animasi getar. */
  const [attempt, setAttempt] = useState(0);

  const fieldErrors = getFieldErrors(login.error);
  const canSubmit = !login.isPending && Boolean(email.trim()) && Boolean(password);

  // Pesan gagal hilang begitu pengguna mulai memperbaiki isiannya.
  const edit = (set: (v: string) => void, value: string) => {
    set(value);
    if (login.isError) login.reset();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await login.mutateAsync({ email: email.trim(), password });
    } catch {
      setAttempt((n) => n + 1);
      return;
    }
    // Kembali ke halaman yang tadi dibuka (hanya path internal, cegah open redirect).
    navigate(safeNextPath(searchParams.get('next')) ?? '/', { replace: true });
  };

  return (
    <form
      key={attempt}
      onSubmit={submit}
      noValidate
      className={cn('flex flex-col gap-3', attempt > 0 && 'animate-shake')}
    >
      <Field label="Email" error={fieldErrors.email}>
        <TextInput
          name="email"
          type="email"
          autoComplete="username"
          autoFocus
          value={email}
          onChange={(e) => edit(setEmail, e.target.value)}
          placeholder="nama@perusahaan.co.id"
          className={fieldErrors.email ? errorInputClass : undefined}
        />
      </Field>
      <Field label="Kata sandi" error={fieldErrors.password}>
        <TextInput
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => edit(setPassword, e.target.value)}
          className={fieldErrors.password ? errorInputClass : undefined}
        />
      </Field>
      {login.isError && !Object.keys(fieldErrors).length && (
        <div role="alert" className="rounded-[9px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {translateBeMessage((login.error as Error).message)}
        </div>
      )}
      <Button type="submit" variant="primary" size="md" disabled={!canSubmit} className="mt-1 w-full">
        {login.isPending ? 'Memeriksa…' : 'Masuk'}
      </Button>
    </form>
  );
}
