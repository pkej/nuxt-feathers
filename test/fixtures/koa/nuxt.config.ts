export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],
  feathers: {
    servicesDir: '../../services',
    auth: false,
    transports: {
      websocket: false,
    },
  },
})
