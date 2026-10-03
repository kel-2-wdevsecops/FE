import { APP_VERSION } from '@/lib/appVersion';
import { cn } from '@/lib/cn';

/** Label versi FE yang sedang berjalan, mis. "Axon Sales v1.1.0". */
export function AppVersion({ className }: { className?: string }) {
  return <span className={cn('tnum text-[11.5px] text-ink-faint', className)}>Axon Sales v{APP_VERSION}</span>;
}
