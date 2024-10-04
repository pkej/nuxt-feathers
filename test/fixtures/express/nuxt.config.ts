export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    transports: ['rest'],
    framework: 'express',
  },
})
