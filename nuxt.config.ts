import { MongoMemoryServer } from 'mongodb-memory-server'

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

  modules: [
    './src/module',
  ],

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
