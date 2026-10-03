import { Navigate } from 'react-router-dom';
import { AppVersion } from '@/components/ui/AppVersion';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginForm } from './components/LoginForm';

export function LoginPage() {
  // Sudah masuk: langsung ke ruang kerja.
  const hasToken = useAuthStore((s) => Boolean(s.accessToken));
  if (hasToken) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="flex w-full max-w-[380px] animate-ams-in flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-[14px] font-semibold text-white">
            AX
          </span>
          <div>
            <div className="text-[16px] font-semibold tracking-[-0.01em]">Axon Sales</div>
            <div className="text-[12.5px] text-ink-faint">Classic Models</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5">
          <div>
            <h1 className="m-0 text-[18px] font-semibold tracking-[-0.015em]">Masuk</h1>
            <p className="mt-1 mb-0 text-[13px] text-ink-muted">Gunakan akun yang dibuat admin.</p>
          </div>
          <LoginForm />
        </div>

        <AppVersion className="text-center" />
      </div>
    </div>
  );
}
