import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { loginPathFor } from '@/lib/loginRedirect';
import { AccountPage } from '@/pages/account/AccountPage';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/login/LoginPage';
import { OfficeDetailPage } from '@/pages/offices/OfficeDetailPage';
import { OfficesPage } from '@/pages/offices/OfficesPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';
import { UsersPage } from '@/pages/users/UsersPage';
import { useAuthStore } from '@/store/useAuthStore';

/** Ruang kerja butuh sesi login; tanpa sesi -> /masuk?next=<halaman ini>. */
function RequireAuth({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();
  if (!accessToken) return <Navigate to={loginPathFor(location.pathname + location.search)} replace />;
  return children;
}

/**
 * Route khusus admin. Hanya kenyamanan tampilan (staf diarahkan ke Beranda);
 * otorisasi sebenarnya tetap di BE (requireRole), yang menjawab 403.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/masuk" element={<LoginPage />} />

      <Route
        path="*"
        element={
          <RequireAuth>
            <AppShell>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/akun" element={<AccountPage />} />
                <Route path="/kantor" element={<OfficesPage />} />
                <Route path="/kantor/:code" element={<OfficeDetailPage />} />
                <Route path="/pengguna" element={<RequireAdmin><UsersPage /></RequireAdmin>} />
                <Route path="/pengguna/:id" element={<RequireAdmin><UserDetailPage /></RequireAdmin>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
