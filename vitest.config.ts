import path from 'path'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

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
