// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-21',

  extends: [
    '@gabortorma/nuxt-eslint-layer',
  ],

  modules: [
    '../src/module',
  ],

  feathers: {
    servicesDirs: '../services',
  },

  ssr: true,

  devtools: { enabled: false },
})
