export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    transports: ['websockets'],
    framework: false,
  },
})
