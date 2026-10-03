import { NavLink } from 'react-router-dom';
import { useLogout } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/cn';
import { initials } from '@/lib/format';
import { ROLE_LABEL } from '@/lib/labels';

/** Akun yang sedang masuk (menuju halaman Akun) + tombol Keluar, di kaki sidebar. */
export function SidebarUser({ onNavigate }: { onNavigate?: () => void }) {
  const user = useCurrentUser();
  const logout = useLogout();
  if (!user) return null;

  return (
    <div className="flex items-center gap-1 border-t border-line-soft pt-2">
      <NavLink
        to="/akun"
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors',
            isActive ? 'bg-accent-soft' : 'hover:bg-line-soft',
          )
        }
      >
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-accent text-[11.5px] font-medium text-white">
          {initials(user.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium text-ink">{user.name}</span>
          <span className="block text-[11.5px] text-ink-faint">{ROLE_LABEL[user.role]}</span>
        </span>
      </NavLink>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="shrink-0 cursor-pointer rounded-lg px-2 py-2 text-[12.5px] text-ink-muted hover:bg-line-soft hover:text-ink disabled:opacity-50"
      >
        Keluar
      </button>
    </div>
  );
}
