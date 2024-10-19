export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],
  feathers: {
    servicesDirs: ['../../services'],
    auth: false,
    transports: {
      websocket: false,
    },
  },
})
