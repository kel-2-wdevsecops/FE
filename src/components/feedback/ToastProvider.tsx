import { Toaster } from 'react-hot-toast';

/** Notifikasi toast global — dipakai interceptor axios (401, dll) dan mutation. */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3200,
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-ink)',
          fontSize: 13,
          border: '1px solid var(--color-line)',
          borderRadius: 10,
          padding: '12px 16px',
        },
        success: {
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          iconTheme: { primary: '#166534', secondary: '#f0fdf4' },
        },
        error: {
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
          iconTheme: { primary: '#b91c1c', secondary: '#fef2f2' },
        },
      }}
    />
  );
}
