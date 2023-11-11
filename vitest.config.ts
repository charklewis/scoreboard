import path from 'path'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    restoreMocks: true,
    exclude: [...configDefaults.exclude, 'playwright/**'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
}
