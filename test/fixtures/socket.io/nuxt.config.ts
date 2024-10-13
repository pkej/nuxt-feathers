export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    servicesDir: '../../services',
    transports: {
      rest: false,
    },
  },
})
