// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  extends: [
    '@gabortorma/nuxt-eslint-layer',
  ],

  alias: {
    'nuxt-feathers': '../../src/',
  },

  imports: {
    autoImport: true,
  },

  modules: [
    '../src/module',
  ],

  feathers: {
    transports: ['rest', 'websockets'],
    framework: 'koa',
  },

  ssr: true,

  devtools: { enabled: false },
})
