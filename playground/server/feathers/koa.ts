import type { Application } from '@gabortorma/nuxt-feathers/declarations/server'
import { serveStatic } from '@feathersjs/koa'

export default function koa(app: Application): void {
  console.log('Load static plugin')
  app.use(serveStatic('./public'))
}
