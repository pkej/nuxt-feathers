import { defineFeathersServerPlugin } from 'nuxt-feathers/server'

export const dummyServerPlugin = defineFeathersServerPlugin(() => {
  console.log('Dummy feathers plugin for test')
})
