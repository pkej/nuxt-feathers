import type { ConfigOptions } from './playwright-defaults'
import type { TransportsOptions } from './src/runtime/options/transports'
import { defineConfig } from '@playwright/test'

const transportsOptions: Record<string, TransportsOptions> = {
  'express': {
    rest: { framework: 'express' },
    websocket: false,
  },
  'koa': {
    rest: { framework: 'koa' },
    websocket: false,
  },
  'websocket': {
    rest: false,
    websocket: true,
  },
  'koa+websocket': {
    rest: { framework: 'koa' },
    websocket: true,
  },
  'express+websocket': {
    rest: { framework: 'express' },
    websocket: true,
  },
  'path': {
    rest: { path: '/rest-path' },
    websocket: { path: '/websocket-path' },
  },
}

export default defineConfig<ConfigOptions>({
  testDir: './tests/playwright',
  outputDir: './tests/playwright/results',
  quiet: true,
  projects: [
    ...[false, true].map(ssr =>
      Object.entries(transportsOptions).map(([k, transports]) => {
        return {
          name: ssr ? `ssr:${k}` : k,
          testMatch: /client|pinia/,
          use: {
            defaults: {
              nuxt: {
                nuxtConfig: {
                  feathers: {
                    transports,
                  },
                  ssr,
                },
              },
            },
          },
        }
      }).filter(({ name }) => !/\+/.test(name) || ssr)).flat(2),
    {
      name: 'plugins',
      testMatch: /plugins/,
    },
  ],
})
