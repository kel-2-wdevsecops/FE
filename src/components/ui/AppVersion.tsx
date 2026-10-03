import { APP_VERSION } from '@/lib/appVersion';
import { cn } from '@/lib/cn';

/** Label versi FE yang sedang berjalan, mis. "Web v1.1.0". */
export function AppVersion({ className }: { className?: string }) {
  return <span className={cn('tnum', className)}>Web v{APP_VERSION}</span>;
}
