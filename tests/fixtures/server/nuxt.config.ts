export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  imports: {
    autoImport: true,
  },

  feathers: {
    client: false,
    servicesDirs: [
      '../../../services/messages',
    ],
  },
})
