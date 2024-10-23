import { serveStatic } from '@feathersjs/koa'
import { defineFeathersServerPlugin } from 'nuxt-feathers/server'

export default defineFeathersServerPlugin((app) => {
  app.use(serveStatic('./public'))
})
