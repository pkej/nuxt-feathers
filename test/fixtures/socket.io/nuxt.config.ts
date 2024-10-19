export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    auth: false,
    servicesDirs: ['../../services'],
    transports: {
      rest: false,
    },
  },
})
