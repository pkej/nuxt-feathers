import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { defineConfig } from '@playwright/test'

export default defineConfig<ConfigOptions>({
  testDir: './tests/playwright',
  outputDir: './tests/playwright/results',
})
