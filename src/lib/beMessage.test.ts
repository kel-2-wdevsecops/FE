import { describe, expect, it } from 'vitest';
import { translateBeMessage } from './beMessage';

describe('translateBeMessage', () => {
  it('menerjemahkan pesan yang dikenal', () => {
    expect(translateBeMessage('Too many requests. Please try again later.')).toMatch(/Terlalu banyak/);
    expect(translateBeMessage('Invalid email or password.')).toBe('Email atau kata sandi salah.');
  });

  it('menerjemahkan pesan berpola dengan angkanya', () => {
    expect(translateBeMessage('Office still has 6 employee(s).')).toBe(
      'Kantor masih punya 6 karyawan. Pindahkan karyawannya ke kantor lain dulu.',
    );
  });

  it('pesan yang belum dikenal dikembalikan apa adanya', () => {
    expect(translateBeMessage('Something new.')).toBe('Something new.');
  });
});
