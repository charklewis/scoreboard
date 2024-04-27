import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults } from 'vitest/config'

installGlobals()

export default {
  plugins: [!process.env.VITEST && remix(), tsconfigPaths()],
  server: { port: 3000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    restoreMocks: true,
    exclude: [...configDefaults.exclude, 'playwright/**'],
  },
}
