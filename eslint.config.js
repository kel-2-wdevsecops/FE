// ESLint (flat config). Dijalankan lewat `npm run lint` dan di CI
// (`.github/workflows/ci.yml`); --max-warnings 0 ada di skrip `lint`.
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2023, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      // Aturan hooks klasik saja (sama dengan Skopia FE). Preset `recommended`
      // plugin v7 ikut membawa aturan React Compiler, yang tidak dipakai.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // File komponen hanya meng-export komponen, supaya Fast Refresh jalan.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Parameter/variabel berawalan `_` sengaja tidak dipakai.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
])
