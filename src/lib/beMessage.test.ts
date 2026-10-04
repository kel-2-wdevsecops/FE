import { describe, expect, it } from 'vitest';
import { translateBeMessage } from './beMessage';

describe('translateBeMessage', () => {
  it('menerjemahkan pesan yang dikenal', () => {
    expect(translateBeMessage('Too many requests. Please try again later.')).toBe(
      'Terlalu banyak permintaan. Coba lagi sebentar lagi.',
    );
  });

  it('pesan lain apa adanya', () => {
    expect(translateBeMessage('Network Error')).toBe('Network Error');
  });
});
