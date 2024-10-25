export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  imports: {
    autoImport: true,
  },

  feathers: {
    server: {
      plugins: [
        '../plugins/dummy-messages.ts',
        '../plugins/dummy-users.ts',
      ],
    },
    servicesDirs: [
      '../../../services/messages',
      '../../../services/users',
    ],
  },
})
