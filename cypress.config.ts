import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    projectId: '217564',
    baseUrl: 'http://localhost:3000',
    retries: { runMode: 3, openMode: 0 },
  },
})
