export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    servicesDirs: [
      '../../../services/messages',
      '../../../services/users', // for auth
    ],
    transports: {
      rest: false,
    },
  },
})
