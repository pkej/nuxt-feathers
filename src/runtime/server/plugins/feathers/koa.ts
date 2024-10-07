import type { AuthenticationSettings } from '@feathersjs/koa'
import type { Application } from '../../../declarations'

import { feathers } from '@feathersjs/feathers'
import { bodyParser, koa as feathersKoa, parseAuthentication, rest, serveStatic } from '@feathersjs/koa'

export function createFeathersKoaApp(authenticate?: AuthenticationSettings | false): Application {
  const app: Application = feathersKoa(feathers())

  app.use(bodyParser())

  app.use(serveStatic('./test/fixtures/public'))

  app.use(parseAuthentication())

  app.configure(rest())

  return app
}
