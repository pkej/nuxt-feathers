export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    auth: false,
    servicesDir: '../../services',
    transports: {
      rest: false,
    },
  },
})
