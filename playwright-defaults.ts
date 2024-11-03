import type { TestOptions as SetupOptions, TestOptions } from '@nuxt/test-utils/e2e'
import { createTest } from '@nuxt/test-utils/e2e'
import { test as nuxt, type ConfigOptions as NuxtConfigOptions } from '@nuxt/test-utils/playwright'
import defu from 'defu'

export interface ConfigOptions extends NuxtConfigOptions {
  defaults: {
    nuxt: Partial<SetupOptions> | undefined
  }
}

export const test = nuxt.extend<TestOptions, WorkerOptions & ConfigOptions>({
  defaults: [{ nuxt: undefined }, { option: true, scope: 'worker' }],
  _nuxtHooks: [
    async ({ defaults, nuxt }, use) => {
      const hooks = createTest(defu(nuxt || {}, defaults.nuxt || {}))
      await hooks.setup()
      await use(hooks)
      await hooks.afterAll()
    },
    { scope: 'worker' },
  ],
})
