import type { ClientApplication } from '../declarations/client'
import { defineNuxtPlugin } from '#app'
import { feathers } from '@feathersjs/feathers'
import { createPiniaClient } from 'feathers-pinia'
import { authentication } from './client/authentication'
import { connection } from './client/connection'

/**
 * Creates a Feathers Rest client for the SSR server and a Socket.io client for the browser.
 * Also provides a cookie-storage adapter for JWT SSR using Nuxt APIs.
 */
export default defineNuxtPlugin(async (nuxt) => {
  // create the feathers client
  const feathersClient: ClientApplication = feathers()

  feathersClient.configure(connection)
  feathersClient.configure(authentication)
  await nuxt.hooks.callHook('feathers:beforeCreate', feathersClient)

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

  await nuxt.hooks.callHook('feathers:afterCreate', feathersClient)

  return { provide: { api } }
})
