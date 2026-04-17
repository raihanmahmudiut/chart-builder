import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '#imports': resolve(__dirname, '.nuxt/imports.d.ts'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    globals: true,
    setupFiles: ['tests/setup.ts'],
  },
})
