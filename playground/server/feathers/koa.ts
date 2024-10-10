import type { Application } from 'nuxt-feathers/runtime/declarations/server'
import { serveStatic } from '@feathersjs/koa'

export default function koa(app: Application): void {
  console.log('Load static plugin')
  app.use(serveStatic('./public'))
}
