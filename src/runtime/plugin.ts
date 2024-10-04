import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  name: 'nuxt-feathers-plugin',
  // eslint-disable-next-line unused-imports/no-unused-vars
  setup: (nuxtApp) => {
    console.log('nuxt-feathers-plugin setup')
  },
  hooks: {
    'app:created'() {
      console.log('nuxt-feathers-plugin app:created')
    },
  },
})
