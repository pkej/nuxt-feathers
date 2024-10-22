export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    client: false,
    servicesDirs: [
      '../../../services/messages',
    ],
  },
})
