import { http } from './http';
import type { Health } from '@/types';

/**
 * Satu-satunya lapisan yang tahu endpoint BE. Alur wajib satu arah:
 * komponen -> hook (src/hooks) -> api.* (file ini) -> http.
 */
export const api = {
  health: () => http.get<Health>('/health'),
};
