export default defineNuxtConfig({
  compatibilityDate: '2024-09-14',

  extends: ['@gabortorma/nuxt-eslint-layer'],

  modules: [
    '../src/module',
  ],

  nuxtFeathers: {},

  watch: [
    '../src/module.ts',
  ],

  devtools: { enabled: true },
})
