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
      ],
    },
    client: false,
    servicesDirs: [
      '../../../services/messages',
    ],
  },
})
