import type { Application } from 'nuxt-feathers/runtime/declarations/server'
import { serveStatic } from '@feathersjs/koa'

export default function (app: Application): void {
  app.use(serveStatic('./public'))
}
