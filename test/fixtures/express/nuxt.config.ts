export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],
  feathers: {
    servicesDir: '../../services',
    auth: false,
    transports: {
      rest: {
        framework: 'express',
      },
      websocket: false,
    },
  },
})
