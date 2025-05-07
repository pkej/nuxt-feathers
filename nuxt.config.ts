import { MongoMemoryServer } from 'mongodb-memory-server'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const mongod = await MongoMemoryServer.create()
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-27',
  future: {
    compatibilityVersion: 4,
  },
  extends: [
    '@gabortorma/nuxt-eslint-layer',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error config.plugins' is possibly 'undefined'
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    './src/module',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  imports: {
    autoImport: true,
  },
  feathers: {
    servicesDirs: './services',
    database: {
      mongo: {
        url: mongod.getUri(),
      },
    },
    client: {
      pinia: {
        idField: 'id', // use _id for mongoDB
        services: {
          mongos: {
            idField: '_id',
          },
        },
      },
    },
  },
  hooks: {
    close: async () => {
      await mongod.stop()
    },
  },
  ssr: true,
  devtools: { enabled: true },
  typescript: {
    builder: 'shared',
    tsConfig: {
      include: [
        '../.release-it.ts',
        '../.global.d.ts',
      ],
    },
  },
})
