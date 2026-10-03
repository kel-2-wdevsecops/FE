import { describe, expect, it } from 'vitest';
import { loginPathFor, safeNextPath } from './loginRedirect';

describe('safeNextPath', () => {
  it('menerima path internal', () => {
    expect(safeNextPath('/kantor/1')).toBe('/kantor/1');
    expect(safeNextPath('/pengguna?search=admin')).toBe('/pengguna?search=admin');
  });

  it.each([
    ['//evil.example/x', 'protocol-relative URL'],
    ['/\\evil.example', 'backslash, dibaca browser sebagai //'],
    ['https://evil.example', 'URL absolut'],
    ['javascript:alert(1)', 'skema javascript'],
    ['kantor/1', 'path relatif'],
  ])('menolak %s (%s)', (input) => {
    expect(safeNextPath(input)).toBeNull();
  });

  it('menolak kembali ke halaman masuk (loop)', () => {
    expect(safeNextPath('/masuk?next=/kantor')).toBeNull();
  });

  it('null / kosong → null', () => {
    expect(safeNextPath(null)).toBeNull();
    expect(safeNextPath('')).toBeNull();
  });
});

describe('loginPathFor', () => {
  it('membawa tujuan sebagai ?next= yang di-encode', () => {
    expect(loginPathFor('/kantor/1?tab=info')).toBe('/masuk?next=%2Fkantor%2F1%3Ftab%3Dinfo');
  });

  it('root tidak perlu ?next=', () => {
    expect(loginPathFor('/')).toBe('/masuk');
  });

  it('hasilnya lolos safeNextPath (bolak-balik)', () => {
    const next = new URL(loginPathFor('/kantor/1'), 'http://x').searchParams.get('next');
    expect(safeNextPath(next)).toBe('/kantor/1');
  });
});
