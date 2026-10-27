import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages serves this Vite output at a project subdirectory.
  base: '/qgreendc-dashboard/vue-experiment4/',
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
    restoreMocks: true
  }
})
