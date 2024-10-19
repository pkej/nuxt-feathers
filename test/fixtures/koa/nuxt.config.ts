export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],
  feathers: {
    servicesDirs: ['../../../services/messages'],
    auth: false,
    transports: {
      websocket: false,
    },
  },
})
