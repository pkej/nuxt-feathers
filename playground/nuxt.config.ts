export default defineNuxtConfig({
  compatibilityDate: '2024-09-14',

  modules: [
    '@nuxt/eslint',
    '../src/module',
  ],

  myModule: {},

  eslint: {
    checker: true,
    config: {
      standalone: false,
    },
  },

  devtools: { enabled: true },
})
