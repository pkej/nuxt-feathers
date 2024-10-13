import type { TransportConnection } from '@feathersjs/feathers'
import type { ClientApplication, ServiceTypes } from '../declarations/client'
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#app'
import authenticationClient from '@feathersjs/authentication-client'
import { feathers } from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import socketioClient from '@feathersjs/socketio-client'
import { createPiniaClient, OFetch } from 'feathers-pinia'
import { $fetch } from 'ofetch'
import { io } from 'socket.io-client'

/**
 * Creates a Feathers Rest client for the SSR server and a Socket.io client for the browser.
 * Also provides a cookie-storage adapter for JWT SSR using Nuxt APIs.
 */
export default defineNuxtPlugin(async (nuxt) => {
  // const host = import.meta.env.VITE_MYAPP_API_URL as string || 'http://localhost:3000' // uncomment for feathers-api server run by Nuxt

  const { transports } = useRuntimeConfig().public

  // Store JWT in a cookie for SSR.
  const storageKey = 'feathers-jwt'
  const jwt = useCookie<string | null>(storageKey)
  const storage = {
    getItem: () => jwt.value,
    setItem: (key: string, val: string) => (jwt.value = val),
    removeItem: () => (jwt.value = null),
  }

  function getConnection(): TransportConnection<ServiceTypes> {
    const connection = (import.meta.server || !transports?.websocket)
      ? rest(`/feathers`).fetch($fetch, OFetch)
      : socketioClient(io({ transports: ['websocket'] }))
    return connection
  }

  const connection = getConnection()

  // create the feathers client
  const feathersClient: ClientApplication = feathers()

  feathersClient.configure(connection)
  feathersClient.configure(authenticationClient({ storage, storageKey }))
  feathersClient.set('connection', connection)

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
