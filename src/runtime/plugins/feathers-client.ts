import type { ClientApplication } from 'nuxt-feathers/client'
import { defineNuxtPlugin } from '#app'
import { createPiniaClient } from 'feathers-pinia'
import { createClient } from 'nuxt-feathers/client'

/**
 * Creates a Feathers Rest client for the SSR server and a Socket.io client for the browser.
 * Also provides a cookie-storage adapter for JWT SSR using Nuxt APIs.
 */
export default defineNuxtPlugin(async (nuxt) => {
  // create the feathers client
  const feathersClient: ClientApplication = createClient()

  // wrap the feathers client
  const api = createPiniaClient(feathersClient, {
    pinia: nuxt.$pinia,
    ssr: !!import.meta.server,
    idField: 'id', // use _id for mongoDB
    whitelist: [],
    paramsForServer: [],
    skipGetIfExists: true,
    customSiftOperators: {},
  })

  return { provide: { api } }
})
