export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],
  feathers: {
    servicesDirs: ['../../../services/messages'],
    auth: false,
    client: false,
    transports: {
      websocket: false,
    },
  },
})
