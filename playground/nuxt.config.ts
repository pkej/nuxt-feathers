// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  extends: [
    '@gabortorma/nuxt-eslint-layer',
  ],

  imports: {
    autoImport: true,
  },

  modules: [
    '../src/module',
  ],

  feathers: {
    servicesDirs: '../services',
  },

  ssr: true,

  devtools: { enabled: false },
})
