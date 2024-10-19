export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],
  feathers: {
    servicesDirs: ['../../../services/messages'],
    auth: false,
    transports: {
      rest: {
        framework: 'express',
      },
      websocket: false,
    },
  },
})
