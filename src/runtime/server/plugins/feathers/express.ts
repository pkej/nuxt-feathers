import type { AuthenticationSettings } from '@feathersjs/express'
import type { Application } from '../../../declarations'
import feathersExpress, { json, parseAuthentication, rest, serveStatic, urlencoded } from '@feathersjs/express'
import { feathers } from '@feathersjs/feathers'

export function createFeathersExpressApp(authenticate?: AuthenticationSettings | false): Application {
  const app: Application = feathersExpress(feathers())

  app.use(json())

  app.use(urlencoded({ extended: true }))

  app.use('/', serveStatic('./test/fixtures/public'))

  app.use(parseAuthentication())

  app.configure(rest())

  return app
}
