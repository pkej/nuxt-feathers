import type { Application } from 'nuxt-feathers/server'
import { serveStatic } from '@feathersjs/koa'

export default function (app: Application): void {
  void app.use(serveStatic('./public'))
}
