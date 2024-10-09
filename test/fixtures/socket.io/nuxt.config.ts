export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],

  feathers: {
    servicesDir: '../../services',
    transports: ['websockets'],
    framework: false,
  },
})
