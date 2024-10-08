import type { Application } from '@gabortorma/nuxt-feathers'
import { serveStatic } from '@feathersjs/koa'

export default function (app: Application): void {
  console.log('Load static plugin')
  app.use(serveStatic('./public'))
}
