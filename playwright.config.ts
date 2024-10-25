import type { ConfigOptions } from '@nuxt/test-utils/playwright'
import { defineConfig, devices } from '@playwright/test'

const devicesToTest = [
  'Chrome',
  'Firefox',
  'Safari',
] satisfies Array<string | typeof devices[string]>

export default defineConfig<ConfigOptions>({
  testDir: './tests/playwright',
  outputDir: './tests/playwright/results',
  quiet: true,
  projects: devicesToTest.map(p => ({
    name: p,
    use: devices[`Desktop ${p}`],
  })),
})
