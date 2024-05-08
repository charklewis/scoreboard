import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults } from 'vitest/config'

installGlobals()

const filesToExclude = [
  ...configDefaults.exclude,
  'playwright/**',
  'drizzle/**',
  'public/**',
  'app/services/**',
  'app/database/**',
  'app/entry.client.tsx',
  'app/root.tsx',
  'app/test-utils.tsx',
  '.eslintrc.cjs',
  '.eslintrc.repo.cjs',
  'playwright.config.ts',
  'postcss.config.mjs',
  'tailwind.config.ts',
]

export default {
  plugins: [!process.env.VITEST && remix(), tsconfigPaths()],
  server: { port: 3000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    restoreMocks: true,
    exclude: filesToExclude,
    coverage: {
      exclude: filesToExclude,
    },
  },
}
