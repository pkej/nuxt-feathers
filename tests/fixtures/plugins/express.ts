import type { Application as FeathersExpressApplication } from '@feathersjs/express'
import { serveStatic } from '@feathersjs/express'
import { defineFeathersServerPlugin } from 'nuxt-feathers/server'

export default defineFeathersServerPlugin((app) => {
  (app as any as FeathersExpressApplication).use('/', serveStatic('./public'))
})
