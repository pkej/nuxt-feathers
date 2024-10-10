import type { NitroApp } from 'nitropack'
import type { Application } from 'nuxt-feathers/runtime/declarations/server'
import { useRuntimeConfig } from '#imports'
import configuration from '@feathersjs/configuration'
import { feathers } from '@feathersjs/feathers'
import { bodyParser, koa as feathersKoa, parseAuthentication, rest } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import { createKoaRouter, createSocketIoRouter, setup } from '@gabortorma/feathers-nitro-adapter'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  let app: Application

  const { transports, framework } = useRuntimeConfig().feathers
  console.log('Feathers plugin started', transports, framework)

  if (transports?.includes('rest')) {
    app = feathersKoa(feathers())

    app.use(bodyParser())
    app.use(parseAuthentication())
    app.configure(rest())
  }
  else if (transports?.includes('websockets')) {
    app = feathers() as Application
  }
  else {
    throw new Error('Undefined transport or framework')
  }

  app.configure(configuration()) // TODO: Move to Nuxt config

  if (transports?.includes('websockets')) {
    app.configure(
      socketio({
        transports: ['websocket'],
      }),
    )
  }

  nitroApp.hooks.hook('feathers:afterSetup', async () => {
    if (transports?.includes('rest')) {
      createKoaRouter(app)
    }
    if (transports?.includes('websockets')) {
      await createSocketIoRouter(app)
    }
  })

  void setup(nitroApp, app) // TODO: make async in Nitro v3
})
