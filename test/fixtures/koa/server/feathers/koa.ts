import type { Application } from '../../../../../src/runtime/declarations'
import { serveStatic } from '@feathersjs/koa'

export default function (app: Application): void {
  app.use(serveStatic('./public'))
}
