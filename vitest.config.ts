import path from 'path'
import react from '@vitejs/plugin-react'

export default {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
}
