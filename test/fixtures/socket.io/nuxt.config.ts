export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    auth: false,
    servicesDirs: ['../../../services/messages'],
    transports: {
      rest: false,
    },
  },
})
