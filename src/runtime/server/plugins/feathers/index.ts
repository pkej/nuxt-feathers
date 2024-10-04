import type { NitroApp } from 'nitropack'
import type { Application } from '../../../declarations'
import { defineNitroPlugin, useRuntimeConfig } from '#imports'
// import { sorter } from '@feathersjs/adapter-commons'
import configuration from '@feathersjs/configuration'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio'
import { createExpressRouter, createKoaRouter, createSocketIoRouter, setup } from '@gabortorma/feathers-nitro-adapter'
import { authentication } from '../../../authentication'
import { channels } from '../../../channels'
import { dummy } from '../../../dummy'
import { services } from '../../../services/index'
import { createFeathersExpressApp } from './express'
import { app as koaApp } from './koa'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  let app: Application

  const { transports, framework } = useRuntimeConfig().feathers
  console.log('Feathers plugin started', transports, framework)

  if (transports?.includes('rest') && framework === 'express')
    app = createFeathersExpressApp()
  else if (transports?.includes('rest') && framework === 'koa')
    app = koaApp
  else if (transports?.includes('websockets'))
    app = feathers()
  else
    throw new Error('Undefined transport or framework')

  app.configure(configuration())

  nitroApp.hooks.hook('feathers:beforeSetup', async () => {
    if (transports?.includes('websockets')) {
      app.configure(
        socketio({
          transports: ['websocket'],
        }),
      )
      app.configure(channels)
    }
    app?.configure(services)
    app?.configure(dummy)

    app?.configure(authentication)
  })

  nitroApp.hooks.hook('feathers:afterSetup', async () => {
    if (transports?.includes('rest')) {
      if (framework === 'express')
        createExpressRouter(app)
      else if (framework === 'koa')
        createKoaRouter(app)
    }
    if (transports?.includes('websockets')) {
      await createSocketIoRouter(app)
    }
  })

  void setup(nitroApp, app) // TODO: make async in Nitro v3
})
