export default defineNuxtConfig({
  extends: [
    '../server',
  ],

  feathers: {
    client: {
      plugins: './client2.ts',
    },
  },
})
